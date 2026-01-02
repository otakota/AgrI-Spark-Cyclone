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
        
        # --- 追加: 品目名変換辞書 ---
        self.crop_display_names = {
            'daikon':'大根',
            'carrot':'人参',
            'chinese_cabbage':'白菜',
            'cabbage':'キャベツ',
            'spinach':'ほうれん草',
            'taro':'里芋',
            'lettuce':'レタス',
            'white_onion':'白ねぎ',
            'green_onion':'青ねぎ',
            'onion':'玉ねぎ',
            'garlic':'にんにく',
            'cucumber':'きゅうり',
            'eggplant':'なす',
            'large_tomato':'大玉トマト',
            'small_tomato':'ミニトマト',
            'green_pepper':'ピーマン',
            'shishito':'ししとう',
            'melon':'メロン',
            'watermelon':'スイカ',
        }
        
        self.target_items = [
            '農業粗収益', '肥料', '薬剤', '光熱動力', 
            '雇用労賃', '農業経営費'
        ]
        
        print(f"--- 診断開始: {self.dataset_dir} ---")
        df_all = self._load_from_folders()
        
        if not df_all.empty:
            self._train_models(df_all)
            print(f"--- 学習完了！ 品目数: {len(self.crop_list)} ---")

    def _normalize(self, text):
        if pd.isna(text): return None
        return unicodedata.normalize('NFKC', str(text)).replace(' ', '').replace('　', '').strip()

    def _load_from_folders(self):
        all_records = []
        base_path = os.path.join(self.dataset_dir, 'H19')
        if not os.path.exists(base_path): return pd.DataFrame()

        for folder in [f for f in os.scandir(base_path) if f.is_dir()]:
            # フォルダ名から表示用の日本語名を取得
            crop_display = self.crop_display_names.get(folder.name, folder.name)
            
            for file_path in glob.glob(os.path.join(folder.path, "*.xls")):
                try:
                    df = pd.read_excel(file_path, header=None)
                    check_area = df.iloc[:30, :5].astype(str).to_string()
                    
                    if "農業粗収益" in check_area or "農業経営費" in check_area:
                        print(f"【解析中】: {os.path.basename(file_path)} ({crop_display})")
                        records = self._parse_income_sheet(df, crop_display)
                        if records:
                            all_records.extend(records)
                except Exception as e:
                    print(f"【エラー】{file_path}: {e}")

        return pd.DataFrame(all_records)

    def _parse_income_sheet(self, df, crop_name):
        if hasattr(df, 'map'):
            df_norm = df.map(self._normalize)
        else:
            df_norm = df.applymap(self._normalize)
        
        target_cols = []
        for col in df_norm.columns:
            if df_norm[col].astype(str).str.contains('10a', na=False).any():
                target_cols.append(col)
        
        region_names = None
        for r in range(5, 15):
            row_vals = df_norm.iloc[r]
            row_str = "".join(row_vals.dropna().astype(str))
            if any(k in row_str for k in ["全国", "都府県", "北海道"]):
                region_names = row_vals.ffill()
                break
        
        if region_names is None: return []

        records = []
        for col_idx in target_cols:
            region = str(region_names[col_idx])
            if region in ["None", "nan"] or "10a" in region: continue
            
            if crop_name not in self.crop_to_regions: self.crop_to_regions[crop_name] = set()
            self.crop_to_regions[crop_name].add(region)

            for item_key in self.target_items:
                for name_col in range(5):
                    mask = df_norm[name_col].str.contains(item_key, na=False)
                    if mask.any():
                        row_idx = df_norm.index[mask][0]
                        val = df.iloc[row_idx, col_idx]
                        try:
                            num_val = pd.to_numeric(str(val).replace(',', ''), errors='coerce')
                            if not pd.isna(num_val):
                                # --- 修正ポイント: 単位を「千円」から「円」に変換 ---
                                records.append({
                                    'crop': crop_name,
                                    'region': region,
                                    'item': item_key,
                                    'value': float(num_val) * 1000  # 1000倍する
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
            # 10aあたりの予測金額（円）
            pred_10a = model.predict(input_encoded)[0]
            
            # --- 農業計算ロジック ---
            # 農業は「月給」ではないため、1ヶ月あたりの計算には注意が必要です
            # 10aあたりの単価 * (面積are / 10) * 物価補正
            total_annual = pred_10a * (area_are / 10.0) * inflation
            
            # 期間で按分 (12ヶ月分を monthsヶ月分にする)
            amount = total_annual * (months / 12.0)
            results[item] = int(max(0, amount))
        
        income = results.get('農業粗収益', 0) - results.get('農業経営費', 0)
        return {
            "status": "success",
            "summary": {
                "売上高": results.get('農業粗収益', 0),
                "経営費計": results.get('農業経営費', 0),
                "農業所得": income
            },
            "details": {k: v for k, v in results.items() if k not in ['農業粗収益', '農業経営費']}
        }