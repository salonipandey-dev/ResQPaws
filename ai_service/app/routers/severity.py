from pathlib import Path

import joblib
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/severity",
    tags=["Severity Prediction"]
)

MODEL_PATH = Path(__file__).resolve().parents[1] / "ml" / "models" / "severity_model.pkl"
model = joblib.load(MODEL_PATH)

class SeverityRequest(BaseModel):
    text: str

@router.post("/predict")
def predict(request: SeverityRequest):
    result = model.predict([request.text])[0]

    return {
        "text": request.text,
        "severity": result
    }
