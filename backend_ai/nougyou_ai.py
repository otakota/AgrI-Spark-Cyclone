import pandas as pd
import xgboost as xgb
import re
import os
import glob

class NougyouPredictor:
    def __init__(self, data_dir=None):
        if data_dir is None:
            base_path = os.path.dirname(os.path.abspath(__file__))
            data_dir = os.path.join(base_path, 'data')
        
        self.models = {}
        self.crop_list = []
        self.region_list = []
        self.target_items = [
            '作物収入', '種苗・苗木', '肥料', '農業薬剤', 
            '光熱動力', '雇用労賃', '農機具', '農用建物', '農業経営費'
        ]
        
        print(f"[{data_dir}] 内の全ファイルをスキャンします...")
        df_full = self._load_all_data(data_dir)
        
        if df_full.empty:
            print("エラー: 学習できるデータが見つかりませんでした。")
            return

        self._train_models(df_full)
        print(f"AI学習完了！ 品目数:{len(self.crop_list)}, 地域数:{len(self.region_list)}")

    def _clean_crop_name(self, text):
        """【強化版】品目名をきれいにする。ゴミならNoneを返す"""
        if not isinstance(text, str): return None
        
        # 明らかなゴミワードを除外
        stop_words = ['単位', '区分', '位', '平均', '計', '農業計', '全調査', '当該', '部門']
        for word in stop_words:
            if word in text:
                return None

        # "(1)" や "1" などの「数字だけ」「数字＋記号だけ」を除外
        # ^[0-9().（）\s]+$ : 数字、カッコ、空白だけの文字列にマッチ
        if re.match(r'^[0-9().（）\s]+$', text):
            return None

        # ア～ンのインデックス除去 (例: "ア　トマト" -> "トマト")
        text = re.sub(r'[ア-ン]\s+', '', text)
        text = text.replace('　', ' ').strip()
        
        # 数字を除去 ("1トマト" -> "トマト")
        text = re.sub(r'[0-9().]', '', text)
        
        # 空文字になったらNG
        if not text:
            return None
            
        # もし「きゅうり すいか」のようにスペース区切りで複数ある場合、先頭だけ取る
        if ' ' in text:
            text = text.split(' ')[0]
            
        return text

    def _make_name(self, row):
        parts = [str(row[i]) for i in [2, 3, 4] if pd.notna(row[i])]
        parts = [p for p in parts if p != 'nan' and p != 'うち']
        return parts[-1] if parts else None

    def _load_all_data(self, data_dir):
        all_records = []
        all_files = glob.glob(os.path.join(data_dir, '*.xls'))
        
        balance_files = []
        for f in all_files:
            match = re.search(r'(\d+)\.xls$', f)
            if match:
                num = int(match.group(1))
                if num % 4 == 0: # 末尾が4の倍数が収支ファイル
                    balance_files.append((f, num))

        print(f"検出された収支ファイル数: {len(balance_files)}個")

        for file_bal, num in balance_files:
            # 対になる概況ファイル(番号-2)を探す
            target_num_str = f"{num - 2:03d}.xls"
            file_over = re.sub(r'\d+\.xls$', target_num_str, file_bal)
            
            if not os.path.exists(file_over):
                continue
            
            try:
                # 1. 概況ファイルから品目名を取得
                df_over = pd.read_excel(file_over, header=None)
                
                # 【修正】作物名が5行目にあるか6行目にあるか探る
                # 通常は6行目(index 6)だが、データによってはズレる
                crop_row_candidates = [df_over.iloc[6], df_over.iloc[5]]
                crop_row = None
                
                # 候補の中から「日本語（ひらがなカタカナ漢字）が含まれる行」を採用
                for candidate in crop_row_candidates:
                    # 行全体を文字列化して、日本語っぽい文字があるかチェック
                    row_str = str(candidate.values)
                    if re.search(r'[ぁ-んァ-ン一-龥]', row_str): 
                        crop_row = candidate.ffill()
                        break
                
                if crop_row is None:
                    continue # 品目行が見つからないファイルはスキップ

                # 2. 収支ファイルから金額を取得
                df_bal = pd.read_excel(file_bal, header=None)
                regions = df_bal.iloc[3].ffill()
                
                df_bal_clean = df_bal.iloc[8:].copy()
                df_bal_clean['項目名_加工'] = df_bal_clean.apply(self._make_name, axis=1)
                
                is_per_10a = df_bal.iloc[5].astype(str).str.contains('10a')
                
                for col_idx, is_target in is_per_10a.items():
                    if is_target:
                        r_name = regions[col_idx]
                        
                        # 品目名の取得 & クリーニング
                        if col_idx >= len(crop_row): continue
                        raw_crop = crop_row.get(col_idx)
                        crop_name = self._clean_crop_name(raw_crop)
                        
                        if not crop_name: continue

                        for idx, row in df_bal_clean.iterrows():
                            item_name = row['項目名_加工']
                            val = row[col_idx]
                            
                            if item_name:
                                try:
                                    val = float(val)
                                    all_records.append({
                                        '品目': crop_name,
                                        '地域': r_name,
                                        '項目': item_name,
                                        '金額_10a': val
                                    })
                                except:
                                    continue
            except Exception as e:
                print(f"読み込みスキップ: {os.path.basename(file_bal)} ({e})")
                
        return pd.DataFrame(all_records)

    def _train_models(self, df):
        if df.empty: return

        # 重複データ（同じ品目・地域が複数ファイルにある場合）は平均をとる
        df_pivot = df.pivot_table(index=['品目', '地域'], columns='項目', values='金額_10a', aggfunc='mean').reset_index()
        
        for item in self.target_items:
            if item not in df_pivot.columns:
                df_pivot[item] = 0
        df_pivot = df_pivot.fillna(0)
        
        self.crop_list = sorted(df_pivot['品目'].unique().tolist())
        self.region_list = sorted(df_pivot['地域'].unique().tolist())
        
        # 学習
        X = pd.get_dummies(df_pivot[['品目', '地域']], columns=['品目', '地域'])
        self.feature_columns = X.columns
        
        for item in self.target_items:
            y = df_pivot[item]
            model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=50)
            model.fit(X, y)
            self.models[item] = model

    def predict(self, crop, region, area, months=12, inflation=1.0):
        if crop not in self.crop_list:
            return {"error": f"品目 '{crop}' はデータにありません。"}
            
        input_df = pd.DataFrame({'品目': [crop], '地域': [region]})
        input_encoded = pd.get_dummies(input_df)
        input_encoded = input_encoded.reindex(columns=self.feature_columns, fill_value=0)
        
        result = {}
        period_ratio = months / 12.0
        
        for item, model in self.models.items():
            pred_10a_thous = model.predict(input_encoded)[0]
            amount = pred_10a_thous * (area / 10) * 1000 * inflation * period_ratio
            result[item] = int(amount)
            
        income = result['作物収入'] - result['農業経営費']
        
        return {
            "status": "success",
            "summary": {
                "売上高": result['作物収入'],
                "経営費計": result['農業経営費'],
                "農業所得": income
            },
            "details": {k: v for k, v in result.items() if k not in ['作物収入', '農業経営費']}
        }