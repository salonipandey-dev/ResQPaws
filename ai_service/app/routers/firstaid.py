from fastapi import APIRouter
from app.schemas.request import FirstAidRequest
from app.services.rag_service import get_first_aid

router = APIRouter(prefix="/firstaid", tags=["First Aid"])

@router.post("/help")
def first_aid(data: FirstAidRequest):
    return get_first_aid(data.issue)