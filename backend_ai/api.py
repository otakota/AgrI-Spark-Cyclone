from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nougyou_ai import NougyouPredictor
import os

app = FastAPI()

# CORS設定 (Next.jsのポート3000からのアクセスを許可する)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AIモデルの初期化 (起動時に1回だけ読み込むので高速)
# dataディレクトリは api.py と同じ階層の data を指定
current_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(current_dir, 'data')
ai = NougyouPredictor(data_dir=data_dir)

# リクエストデータの型定義
class PredictionRequest(BaseModel):
    crop: str
    region: str
    area: float
    months: int = 12
    inflation: float = 1.2

@app.get("/")
def read_root():
    return {"status": "AI Server is running"}

@app.get("/options")
def get_options():
    """品目と地域のリストを返す（ドロップダウン用）"""
    return {
        "crops": ai.crop_list,
        "regions": ai.region_list
    }

@app.post("/predict")
def predict(req: PredictionRequest):
    """収支予測を実行する"""
    result = ai.predict(
        crop=req.crop,
        region=req.region,
        area=req.area,
        months=req.months,
        inflation=req.inflation
    )
    
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result