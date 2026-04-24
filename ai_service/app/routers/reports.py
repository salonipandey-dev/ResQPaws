from fastapi import APIRouter
from app.schemas.request import FullReportRequest
from app.services.trust_service import calculate_trust
from app.services.triage_service import predict_severity
from app.services.duplicate_service import check_duplicate
from app.services.rag_service import get_first_aid

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/trust/{username}")
def trust(username: str):
    return calculate_trust(username)

@router.post("/full-analysis")
def full_analysis(data: FullReportRequest):

    severity = predict_severity(data.text)
    duplicate = check_duplicate(data.text, data.location)
    trust = calculate_trust(data.username)
    firstaid = get_first_aid(data.text)

    return {
        "report_text": data.text,
        "location": data.location,
        "user": data.username,
        "severity": severity,
        "duplicate_check": duplicate,
        "trust": trust,
        "first_aid": firstaid
    }