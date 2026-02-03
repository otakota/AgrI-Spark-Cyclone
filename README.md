# AgrI-Spark-Cyclone

AI を活用して **新規就農者の申請・準備を支援**する Web アプリです。  
フォーム入力 → 必要書類（申請書/下書き等）の自動生成を目指します。  


---

## 主な機能

- フォームで必要情報を入力（就農計画/自己情報/資金計画など）  
- 入力内容をもとに AI が申請書（または申請支援文書）の下書きを生成  
- （任意）Excelで出力・ダウンロード  
- （任意）履歴の保存、編集、再生成

---

## 技術スタック

- Frontend: Next.js 14 / TypeScript / React / Tailwind CSS
- Package Manager: pnpm
- Deploy: Vercel
- DB: Supabase
- Others: Docker
- API: OpenAIAPI

---

## ディレクトリ構成（概要）

- `app/` : Next.js App Router（ページ/レイアウト）
- `components/` : UI コンポーネント
- `lib/` : ユーティリティ
- `types/` : 型定義
- `backend_ai/` : AI/バックエンド関連
- `excel_user/` : Excel 出力

---

## クイックスタート（ローカル）

### 必要要件
- Node.js（`.nvmrc` のバージョン推奨）
- pnpm

### セットアップ

```bash
# Node バージョンを合わせる（nvm 使用時）
nvm install
nvm use

# 依存関係
pnpm install

# 環境変数（例）
cp .env.example .env.local
# .env.local を編集（※後述）

# 起動
pnpm dev



