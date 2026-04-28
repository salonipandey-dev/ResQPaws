from fastapi import APIRouter
from pydantic import BaseModel
from app.services.firstaid_service import get_first_aid

router = APIRouter(
    prefix="/firstaid",
    tags=["First Aid Intelligence"]
)

class AidRequest(BaseModel):
    text: str

@router.post("/guide")
def guide(request: AidRequest):
    return get_first_aid(request.text)