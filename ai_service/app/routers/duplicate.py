from fastapi import APIRouter
from pydantic import BaseModel
from app.services.duplicate_service import detect_duplicate

router = APIRouter(
    prefix="/duplicate",
    tags=["Duplicate Detection"]
)

class DuplicateRequest(BaseModel):
    text: str
    location: str
    lat: float
    lng: float

@router.post("/check")
def check_report(request: DuplicateRequest):
    return detect_duplicate(
        request.text,
        request.location,
        request.lat,
        request.lng
    )