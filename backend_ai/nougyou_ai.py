import pandas as pd
import xgboost as xgb
import os
import glob
import re
import unicodedata
import numpy as np

class NougyouPredictor:
    def __init__(self, dataset_dir):
        self.dataset_dir = dataset_dir
        self.models = {}
        self.crop_list = []
        self.crop_to_regions = {}
        self.feature_columns = []
        
        # --- 作物名変換辞書 ---
        self.crop_display_names = {
            'daikon':'大根', 'carrot':'人参', 'chinese_cabbage':'白菜',
            'cabbage':'キャベツ', 'spinach':'ほうれん草', 'taro':'里芋',
            'lettuce':'レタス', 'white_onion':'白ねぎ', 'green_onion':'青ねぎ',
            'onion':'玉ねぎ', 'garlic':'にんにく', 'cucumber':'きゅうり',
            'eggplant':'なす', 'large_tomato':'大玉トマト', 'small_tomato':'ミニトマト',
            'green_pepper':'ピーマン', 'shishito':'ししとう', 'melon':'メロン', 'watermelon':'スイカ'
        }
        
        self.target_items = ['農業粗収益', '肥料', '薬剤', '光熱動力', '雇用労賃', '農業経営費']
        
        print(f"--- 診断開始: {self.dataset_dir} ---")
        df_all = self._load_from_folders()
        
        if not df_all.empty:
            self._train_models(df_all)
            print(f"--- 学習完了！ 品目数: {len(self.crop_list)} ---")
        else:
            print("【致命的エラー】学習データが作成されませんでした。")

    def _normalize(self, text):
        if pd.isna(text): return None
        return unicodedata.normalize('NFKC', str(text)).replace(' ', '').replace('　', '').strip()

    def _load_from_folders(self):
        """
        フォルダ構造を自動走査: dataset / 年度 / 経営形態 / 作物名 / *.xls
        """
        all_records = []
        if not os.path.exists(self.dataset_dir): return pd.DataFrame()

        # 1. 年度フォルダ (H17, H18, H19...)
        for year_entry in [f for f in os.scandir(self.dataset_dir) if f.is_dir()]:
            # 2. 経営形態フォルダ (露地野菜, 施設野菜...)
            for type_entry in [f for f in os.scandir(year_entry.path) if f.is_dir()]:
                # 3. 作物名フォルダ (daikon, carrot...)
                for crop_entry in [f for f in os.scandir(type_entry.path) if f.is_dir()]:
                    
                    crop_display = self.crop_display_names.get(crop_entry.name, crop_entry.name)
                    
                    for file_path in glob.glob(os.path.join(crop_entry.path, "*.xls")):
                        try:
                            # 判定用に少量読み込み
                            df_check = pd.read_excel(file_path, header=None, nrows=40)
                            check_area = df_check.astype(str).to_string()
                            
                            # H16のように収支と分析が混在していても、「収益/経営費」があれば読み込む
                            if "農業粗収益" in check_area or "農業経営費" in check_area:
                                print(f"【解析中】: {year_entry.name}/{type_entry.name}/{crop_display} ({os.path.basename(file_path)})")
                                
                                # 解析には全データを読み込む
                                df_full = pd.read_excel(file_path, header=None)
                                records = self._parse_income_sheet(df_full, crop_display)
                                if records:
                                    all_records.extend(records)
                        except Exception as e:
                            print(f"【エラー】{file_path}: {e}")

        return pd.DataFrame(all_records)

    def _parse_income_sheet(self, df, crop_name):
        # バージョン互換性を持たせた正規化
        df_norm = df.map(self._normalize) if hasattr(df, 'map') else df.applymap(self._normalize)
        
        # 10a列の特定
        target_cols = [col for col in df_norm.columns if df_norm[col].astype(str).str.contains('10a', na=False).any()]
        if not target_cols: return []

        # 地域行の特定
        region_names = None
        for r in range(5, 20): # 探索範囲を20行まで拡大
            row_str = "".join(df_norm.iloc[r].dropna().astype(str))
            if any(k in row_str for k in ["全国", "都府県", "北海道", "平均"]):
                region_names = df_norm.iloc[r].ffill()
                break
        
        if region_names is None: return []

        records = []
        for col_idx in target_cols:
            region = str(region_names[col_idx])
            if region in ["None", "nan"] or "10a" in region: continue
            
            if crop_name not in self.crop_to_regions: self.crop_to_regions[crop_name] = set()
            self.crop_to_regions[crop_name].add(region)

            for item_key in self.target_items:
                # 検索範囲を5列目まで拡大
                for name_col in range(6):
                    mask = df_norm[name_col].str.contains(item_key, na=False)
                    if mask.any():
                        row_idx = df_norm.index[mask][0]
                        val = df.iloc[row_idx, col_idx]
                        try:
                            num_val = pd.to_numeric(str(val).replace(',', ''), errors='coerce')
                            if not pd.isna(num_val):
                                records.append({
                                    'crop': crop_name, 'region': region,
                                    'item': item_key, 'value': float(num_val) * 1000
                                })
                                break
                        except: continue
        return records

    def _train_models(self, df):
        self.crop_list = sorted(df['crop'].unique().tolist())
        df_pivot = df.pivot_table(index=['crop', 'region'], columns='item', values='value', aggfunc='mean').reset_index().fillna(0)
        
        X = pd.get_dummies(df_pivot[['crop', 'region']])
        self.feature_columns = X.columns
        
        for item in self.target_items:
            if item in df_pivot.columns:
                model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100)
                model.fit(X, df_pivot[item])
                self.models[item] = model

        for c in self.crop_to_regions:
            self.crop_to_regions[c] = sorted(list(self.crop_to_regions[c]))

    def predict(self, crop, region, area_are, months=12, inflation=1.4):
        if not self.models: return {"error": "学習データがありません"}
        input_data = pd.DataFrame([{'crop': crop, 'region': region}])
        input_encoded = pd.get_dummies(input_data).reindex(columns=self.feature_columns, fill_value=0)
        
        results = {}
        for item, model in self.models.items():
            pred_10a = model.predict(input_encoded)[0]
            total_annual = pred_10a * (area_are / 10.0) * inflation
            amount = total_annual * (months / 12.0)
            results[item] = int(max(0, amount))
        
        income = results.get('農業粗収益', 0) - results.get('農業経営費', 0)
        return {
            "status": "success",
            "summary": {"売上高": results.get('農業粗収益', 0), "経営費計": results.get('農業経営費', 0), "農業所得": income},
            "details": {k: v for k, v in results.items() if k not in ['農業粗収益', '農業経営費']}
        }