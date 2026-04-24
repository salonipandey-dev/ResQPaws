from fastapi import APIRouter
from app.schemas.request import DuplicateRequest
from app.services.duplicate_service import check_duplicate

router = APIRouter(prefix="/duplicate", tags=["Duplicate"])

@router.post("/check")
def duplicate_check(data: DuplicateRequest):
    return check_duplicate(data.text, data.location)
