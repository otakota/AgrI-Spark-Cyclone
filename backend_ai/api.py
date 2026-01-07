from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nougyou_ai import NougyouPredictor
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, 'dataset')
ai = NougyouPredictor(dataset_dir=dataset_path)

class PredictionRequest(BaseModel):
    crop: str
    region: str
    area: float
    months: int = 12
    is_custom: bool = False
    inflation_rev: float = 1.40
    inflation_exp: float = 1.50

@app.get("/options")
def get_options():
    return {"crops": ai.crop_list, "crop_to_regions": ai.crop_to_regions}

@app.post("/predict")
def predict(req: PredictionRequest):
    # カスタムモードでなければ統計値(1.4/1.5)を強制適用
    rev_rate = req.inflation_rev if req.is_custom else 1.40
    exp_rate = req.inflation_exp if req.is_custom else 1.50
    
    return ai.predict(
        crop=req.crop, 
        region=req.region, 
        area_are=req.area, 
        months=req.months,
        inflation_rev=rev_rate,
        inflation_exp=exp_rate
    )