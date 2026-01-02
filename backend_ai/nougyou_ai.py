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
            'green_onion_house':'青ねぎ(施設)',
            'cucumber_house':'きゅうり(施設)',
            'eggplant_house':'なす(施設)',
            'large_tomato_house':'大玉トマト(施設)',
            'small_tomato_house':'ミニトマト(施設)',
            'green_pepper_house':'ピーマン(施設)',
            'shishito_house':'ししとう(施設)',
            'strawberry_house':'苺(施設)',
            'melon_house':'メロン(施設)',
            'watermelon_house':'スイカ(施設)',
            'mikan':'みかん(果樹作)',
            'natsumikan':'夏みかん(果樹作)',
            'hassaku':'はっさく(果樹作)',
            'iyokan':'いよかん(果樹作)',
            'navelorange':'ネーブルオレンジ(果樹作)',
            'apple':'りんご(果樹作)',
            'japanese_pear':'日本梨(果樹作)',
            'persimmon':'柿(果樹作)',
            'biwa':'びわ(果樹作)',
            'peach':'もも(果樹作)',
            'plum':'すもも(果樹作)',
            'cherry':'さくらんぼ(果樹作)',
            'japanese_apricot':'梅(果樹作)',
            'grape':'ぶどう(果樹作)',
            'chestnut':'栗(果樹作)',
            'pineapple':'パインアップル(果樹作)',
            'kiwi_fruit':'キウイフルーツ(果樹作)',
            'chrysanthemum':'菊(切花)',
            'house_chrysanthemum':'菊(切花/施設)',
            'house_rose':'バラ(切花/施設)',
            'house_lilium':'リリウム(切花/施設)',
            'house_carnation':'カーネーション(切花/施設)',
            'cyclamen':'シクラメン(鉢物/施設)',
            'naked_barley':'裸麦',
            'sixrow_barley':'六条大麦',
            'tworow_barley':'二条大麦',
            'tatami':'イ草/畳表',
            'paddy_buckwheat':'そば(水田作)',
            'azuki':'小豆',
            'greenbeans':'いんげん',
            'konjac':'こんにゃく',
            'peanut':'落花生',
            'potato':'じゃがいも',
            'sweetpotato':'さつまいも',
            'tealeaf':'茶',
            'dry_buckwheat':'そば(畑作)',
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
        all_records = []
        if not os.path.exists(self.dataset_dir): return pd.DataFrame()

        year_folders = [f for f in os.scandir(self.dataset_dir) if f.is_dir()]

        for y_folder in year_folders:
            type_folders = [f for f in os.scandir(y_folder.path) if f.is_dir()]
            
            for t_folder in type_folders:
                crop_folders = [f for f in os.scandir(t_folder.path) if f.is_dir()]
                
                for c_folder in crop_folders:
                    # --- 修正ポイント：フォルダ名の空白を除去して辞書を引く ---
                    raw_name = c_folder.name.strip() 
                    crop_display = self.crop_display_names.get(raw_name, raw_name)
                    
                    # デバッグ用：もし辞書にない英語名が出てきたら通知（必要に応じてコメントアウト）
                    if crop_display == raw_name and re.search(r'[a-z]', raw_name):
                        print(f"  [!] 辞書未登録または不一致: '{raw_name}'")

                    files = glob.glob(os.path.join(c_folder.path, "*.xls"))
                    for file_path in files:
                        try:
                            df = pd.read_excel(file_path, header=None)
                            check_area = df.iloc[:30, :5].astype(str).to_string()
                            
                            if "農業粗収益" in check_area or "農業経営費" in check_area:
                                # 表示を 年度/形態/表示名 に統一
                                print(f"【解析中】: {y_folder.name}/{t_folder.name}/{crop_display} ({os.path.basename(file_path)})")
                                records = self._parse_income_sheet(df, crop_display)
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