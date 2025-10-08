# 🪴 AgrI-Spark-Cyclone

Next.js + TypeScript プロジェクト。  
このリポジトリでは **pnpm** を使用して依存関係を管理しています。

---

## 🧠 プロジェクト概要

**AgrI-Spark-Cyclone** は、**AIを活用した新規就農支援を目的とした Web アプリ**です。  
フォーム形式で必要情報を入力するすることで電子で申請書を発行することができます

---

## 🛠 技術構成

| 項目 | 使用技術 |
|------|------------|
| フレームワーク | **Next.js 14** |
| 言語 | **TypeScript** |
| パッケージ管理 | **pnpm** |
| スタイル/UI | **Tailwind CSS |
| デプロイ | **Vercel** |

---

## 📂 ディレクトリ構成（例）

```bash
app/
 ├─ page.tsx           # ルートページ
 ├─ layout.tsx         # 共通レイアウト
 ├─ components/        # UIコンポーネント群
 ├─ lib/               # ユーティリティ関数
 └─ styles/            # グローバルCSS
```
---

## 🚀 開発環境セットアップ

### 1. Node.js のバージョンを合わせる
このプロジェクトでは **nvm** によって Node.js のバージョンを管理しています。  
`.nvmrc` に記載されているバージョンを使用してください。

```bash
nvm install
nvm use
```
### 2.pnpmをinstallしていない場合

```bash
npm install -g pnpm 
```

### 3.依存関係のインストール
```bash
pnpm install
```

### 4.開発サーバーを起動
```bash
pnpm dev
```
https://localhost:3000
を開いて動作確認してください。
