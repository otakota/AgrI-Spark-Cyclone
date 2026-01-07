FROM python:3.11-slim

# 数値計算ライブラリに必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y \
    libgomp1 \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]