FROM node:20-alpine

WORKDIR /app

# ルートにある package.json 類をコピー
COPY package*.json ./
RUN npm install

# 全ファイルをコピー
COPY . .

# backend_ai などの不要なフォルダをビルドに含めない設定は .dockerignore で行います
CMD ["npm", "run", "dev"]