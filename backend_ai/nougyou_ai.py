import pandas as pd
import xgboost as xgb
import re
import os
import glob

class NougyouPredictor:
    def __init__(self, data_dir='data'):
        """
        初期化: データを読み込んでAIを学習させる
        data_dir: Excelファイルが入っているフォルダのパス
        """
        self.models = {}
        self.crop_list = []
        self.region_list = []
        self.target_items = [
            '作物収入', '種苗・苗木', '肥料', '農業薬剤', 
            '光熱動力', '雇用労賃', '農機具', '農用建物', '農業経営費'
        ]
        
        # 1. データ読み込み & 学習実行
        print(f"[{data_dir}] 内のデータを読み込み中...")
        df_full = self._load_all_data(data_dir)
        
        if df_full.empty:
            print("エラー: 有効なデータが見つかりませんでした。")
            return

        self._train_models(df_full)
        print("AI学習完了！準備OKです。")

    def _clean_crop_name(self, text):
        if not isinstance(text, str): return None
        text = re.sub(r'[ア-ン]\s+', '', text)
        text = text.replace('　', '').strip()
        return text

    def _make_name(self, row):
        parts = [str(row[i]) for i in [2, 3, 4] if pd.notna(row[i])]
        parts = [p for p in parts if p != 'nan' and p != 'うち']
        return parts[-1] if parts else None

    def _load_all_data(self, data_dir):
        """指定フォルダ内の全てのExcelペアを探して読み込む"""
        all_records = []
        
        # 収支ファイル (*-004.xls) を全て探す
        balance_files = glob.glob(os.path.join(data_dir, '*004.xls'))
        
        for file_bal in balance_files:
            # 対になる概況ファイル (*-002.xls) を探す
            file_over = file_bal.replace('004.xls', '002.xls')
            
            if not os.path.exists(file_over):
                print(f"スキップ: {file_bal} に対する概況ファイルが見つかりません")
                continue
                
            print(f"学習中: {os.path.basename(file_bal)}")
            
            try:
                # --- Excel読み込み処理 (前回と同じロジック) ---
                df_over = pd.read_excel(file_over, header=None)
                crop_row = df_over.iloc[6].fillna(method='ffill')
                
                df_bal = pd.read_excel(file_bal, header=None)
                regions = df_bal.iloc[3].fillna(method='ffill')
                
                df_bal_clean = df_bal.iloc[8:].copy()
                df_bal_clean['項目名_加工'] = df_bal_clean.apply(self._make_name, axis=1)
                is_per_10a = df_bal.iloc[5].astype(str).str.contains('10a')
                
                for col_idx, is_target in is_per_10a.items():
                    if is_target:
                        r_name = regions[col_idx]
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
                                        '金額_10a': val,
                                        'ファイル': os.path.basename(file_bal) # データソース追跡用
                                    })
                                except:
                                    continue
            except Exception as e:
                print(f"エラー({os.path.basename(file_bal)}): {e}")
                
        return pd.DataFrame(all_records)

    def _train_models(self, df):
        # ピボットテーブル作成
        df_pivot = df.pivot_table(index=['品目', '地域'], columns='項目', values='金額_10a').reset_index()
        for item in self.target_items:
            if item not in df_pivot.columns:
                df_pivot[item] = 0
        df_pivot = df_pivot.fillna(0)
        
        # UI用にリスト保存
        self.crop_list = df_pivot['品目'].unique().tolist()
        self.region_list = df_pivot['地域'].unique().tolist()
        
        # 学習データの作成
        X = pd.get_dummies(df_pivot[['品目', '地域']], columns=['品目', '地域'])
        self.feature_columns = X.columns # 入力形式を保存
        
        for item in self.target_items:
            y = df_pivot[item]
            model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=50)
            model.fit(X, y)
            self.models[item] = model

    def predict(self, crop, region, area, months=12, inflation=1.0):
        """
        外部から呼び出すメイン関数
        months: 期間(ヶ月)
        inflation: 物価補正率
        """
        # 入力チェック
        if crop not in self.crop_list:
            return {"error": f"品目 '{crop}' はデータにありません。"}
        if region not in self.region_list:
            # 地域がない場合は全国平均などが使えないか探すロジックを入れても良い
            # ここでは簡易的にエラーとせず、最も近い予測を出すためそのまま通す(OneHotで全部0になる)
            pass

        # 入力データの作成
        input_df = pd.DataFrame({'品目': [crop], '地域': [region]})
        input_encoded = pd.get_dummies(input_df)
        input_encoded = input_encoded.reindex(columns=self.feature_columns, fill_value=0)
        
        result = {}
        
        # 期間係数 (12ヶ月なら1.0, 6ヶ月なら0.5)
        # ※農業データは年単位が基本なので、単純な月割り計算として実装
        period_ratio = months / 12.0
        
        for item, model in self.models.items():
            pred_10a_thous = model.predict(input_encoded)[0]
            
            # 計算式: 
            # 予測(千円/10a) * (面積/10) * 1000(円) * 物価補正 * 期間補正
            amount = pred_10a_thous * (area / 10) * 1000 * inflation * period_ratio
            result[item] = int(amount)
            
        income = result['作物収入'] - result['農業経営費']
        
        # 結果を辞書で返す
        return {
            "status": "success",
            "input": {"crop": crop, "region": region, "area": area, "months": months},
            "summary": {
                "売上高": result['作物収入'],
                "経営費計": result['農業経営費'],
                "農業所得": income
            },
            "details": {k: v for k, v in result.items() if k not in ['作物収入', '農業経営費']}
        }