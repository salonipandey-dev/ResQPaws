from fastapi import APIRouter
from pydantic import BaseModel
from app.services.trust_service import spam_score

router = APIRouter(
    prefix="/trust",
    tags=["Trust / Spam Detection"]
)

class TrustRequest(BaseModel):
    text: str

@router.post("/check")
def check_trust(request: TrustRequest):
    return spam_score(request.text)