from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nougyou_ai import NougyouPredictor
import os

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 開発時は一旦すべて許可
    allow_methods=["*"],
    allow_headers=["*"],
)

# datasetフォルダのパスを指定して初期化
current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, 'dataset')
ai = NougyouPredictor(dataset_dir=dataset_path)

class PredictionRequest(BaseModel):
    crop: str
    region: str
    area: float
    months: int = 12
    inflation: float = 1.3 # H19(2007年)データのため、少し高めに設定

@app.get("/options")
def get_options():
    return {
        "crops": ai.crop_list,
        "crop_to_regions": ai.crop_to_regions 
    }

@app.post("/predict")
def predict(req: PredictionRequest):
    return ai.predict(req.crop, req.region, req.area, req.months, req.inflation)