from fastapi import APIRouter
from pydantic import BaseModel
from app.services.firstaid_service import get_first_aid

router = APIRouter(
    prefix="/firstaid",
    tags=["First Aid Intelligence"]
)

class AidRequest(BaseModel):
    text: str | None = None
    issue: str | None = None

@router.post("/help")
def guide(request: AidRequest):
    content = (request.issue or request.text or "").strip()
    return get_first_aid(content)
