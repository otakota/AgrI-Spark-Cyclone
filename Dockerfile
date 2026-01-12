FROM node:20-alpine

# pnpmを使えるようにする
RUN corepack enable

WORKDIR /app

# package.json と pnpm-lock.yaml を先にコピー
# (これにより、ソースコードに変更があっても、ライブラリが変わらなければキャッシュが効いて高速になります)
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
# --frozen-lockfile は、ロックファイルを勝手に更新せず、内容を厳密に守る設定です
RUN pnpm install --frozen-lockfile

# その他のソースコードをすべてコピー
COPY . .

# .dockerignore で node_modules を除外していることを前提とします
CMD ["pnpm", "run", "dev"]
