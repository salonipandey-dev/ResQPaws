from fastapi import APIRouter
from pydantic import BaseModel
import joblib

router = APIRouter(
    prefix="/severity",
    tags=["Severity Prediction"]
)

model = joblib.load("app/ml/models/severity_model.pkl")

class SeverityRequest(BaseModel):
    text: str

@router.post("/predict")
def predict(request: SeverityRequest):
    result = model.predict([request.text])[0]

    return {
        "text": request.text,
        "severity": result
    }