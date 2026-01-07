import pandas as pd
import re
import os
import glob
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=UserWarning)

# --- 設定 ---
DATA_DIR = 'data'
# 診断したいファイル名の一部（エラーが出ているこんにゃくいも周辺の番号）
TARGET_FILE_ID = '138' 

def main():
    print("=== 農業AI 診断ツール ===")
    
    # 1. ファイルの存在確認
    files = glob.glob(os.path.join(DATA_DIR, '*.xls'))
    target_files = [f for f in files if TARGET_FILE_ID in f]
    
    print(f"データフォルダ: {os.path.abspath(DATA_DIR)}")
    print(f"ファイル総数: {len(files)}")
    print(f"調査対象ファイル({TARGET_FILE_ID}): {target_files}")
    
    if not target_files:
        print("エラー: 調査対象のファイルが見つかりません。")
        return

    # 収支ファイルを見つける
    income_file = None
    for f in target_files:
        if is_income_file(f):
            income_file = f
            break
            
    if not income_file:
        print("エラー: 収支ファイル('農業粗収益'が含まれるファイル)が見つかりません。")
        # 試しに中身を表示
        for f in target_files:
            print(f"--- {os.path.basename(f)} の冒頭 ---")
            try:
                print(pd.read_excel(f, header=None, nrows=10).to_string())
            except Exception as e:
                print(f"読込失敗: {e}")
        return

    print(f"\n【収支ファイル特定】: {os.path.basename(income_file)}")
    
    # 2. ペア探索のシミュレーション
    print("\n--- ペア（概況ファイル）の探索 ---")
    current_num = int(re.search(r'(\d+)\.xls$', income_file).group(1))
    
    found_pair = None
    for i in range(1, 50):
        target_num = current_num - i
        pair_path = re.sub(r'\d+\.xls$', f"{target_num:03d}.xls", income_file)
        
        if os.path.exists(pair_path):
            print(f"  候補[-{i}]: {os.path.basename(pair_path)} ... ", end="")
            # 中身チェック
            try:
                df = pd.read_excel(pair_path, header=None, nrows=20)
                crop_name = find_single_crop_name(df)
                if crop_name:
                    print(f"OK! 品目名発見: '{crop_name}'")
                    found_pair = pair_path
                    break
                else:
                    print("NG (有効な品目名が見つかりません)")
                    # デバッグ用にこのファイルの品目判定ログを出す
                    debug_crop_detection(df)
            except Exception as e:
                print(f"エラー: {e}")

    if not found_pair:
        print("\n【致命的エラー】 ペアとなる概況ファイルが見つかりませんでした。")
        return

    # 3. データ抽出のシミュレーション
    print(f"\n--- データ抽出テスト ({os.path.basename(found_pair)} + {os.path.basename(income_file)}) ---")
    
    # 概況ファイルから品目
    df_over = pd.read_excel(found_pair, header=None)
    crop_name = find_single_crop_name(df_over)
    print(f"採用された品目名: {crop_name}")

    # 収支ファイルから金額
    df_bal = pd.read_excel(income_file, header=None)
    
    # 地域行の検出
    region_idx = detect_region_row(df_bal)
    print(f"地域行の検出位置: {region_idx}行目")
    if region_idx != -1:
        print(f"地域データ: {df_bal.iloc[region_idx].dropna().tolist()}")
    
    # 10a列の検出
    is_per_10a = None
    for r in range(4, 20):
         if r < len(df_bal) and df_bal.iloc[r].astype(str).str.contains('10a').any():
             print(f"10a列を発見: {r}行目")
             is_per_10a = df_bal.iloc[r].astype(str).str.contains('10a')
             break
    
    if is_per_10a is None:
        print("エラー: '10a' を含む行が見つかりません。")
        return

    # 抽出件数カウント
    count = 0
    regions = df_bal.iloc[region_idx].ffill()
    for col_idx, is_target in is_per_10a.items():
        if is_target:
            r_name = regions[col_idx]
            if is_garbage_text(r_name): continue
            print(f"  -> 抽出対象: 地域='{r_name}', 列={col_idx}")
            count += 1
            
    print(f"\n合計抽出可能列数: {count}")


# --- 以下、nougyou_ai.py のロジックをコピーしたもの ---

def is_income_file(file_path):
    try:
        df = pd.read_excel(file_path, header=None, nrows=20)
        text = df.to_string()
        return "農業粗収益" in text or "農業経営費" in text
    except:
        return False

def clean_crop_name(text):
    if is_garbage_text(text): return None
    text = text.replace('（つづき）', '').replace('つづき', '').strip()
    text = re.sub(r'^[ア-ン]\s+', '', text)
    text = re.sub(r'[0-9().]', '', text)
    if not text: return None
    if ' ' in text: text = text.split(' ')[0]
    return text

def is_garbage_text(text):
    if not isinstance(text, str): return True
    stop_words = ['単位', '区分', '位', '平均', '計', '農業計', '全調査', '当該', '部門', '経営体', '分析指標', '労働時間', '都道府県', '10a', '当たり', '畑作', '水田作']
    for w in stop_words:
        if w in text: return True
    if re.match(r'^[\d\(\)（）\.\s,-]+$', text): return True
    return False

def find_single_crop_name(df):
    # 15行目まで探す
    for i in range(15):
        if i >= len(df): break
        row = df.iloc[i]
        for cell in row:
            s_cell = str(cell).strip()
            cleaned = clean_crop_name(s_cell)
            if cleaned:
                return cleaned
    return None

def debug_crop_detection(df):
    print("    [詳細スキャン]")
    for i in range(min(15, len(df))):
        row = df.iloc[i]
        for cell in row:
            s = str(cell).strip()
            if not pd.isna(cell) and s != 'nan':
                cleaned = clean_crop_name(s)
                print(f"      Row{i}: Raw='{s}' -> Cleaned='{cleaned}'")

def detect_region_row(df):
    pref_keywords = ['北海道', '青森', '全国', '平均', '調査', '農業計', '栃木', '群馬']
    for i in range(2, 20):
        if i >= len(df): break
        row_values = [str(v) for v in df.iloc[i].dropna().values]
        hit = sum(1 for v in row_values if any(k in v for k in pref_keywords))
        if hit >= 1:
            return i
    return -1

if __name__ == "__main__":
    main()