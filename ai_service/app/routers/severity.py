from fastapi import APIRouter
from app.schemas.request import SeverityRequest
from app.services.triage_service import predict_severity

router = APIRouter(prefix="/severity", tags=["Severity"])

@router.post("/predict")
def severity_check(data: SeverityRequest):
    return predict_severity(data.text)