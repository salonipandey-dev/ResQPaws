from fastapi import APIRouter
from app.services.hotspot_service import generate_hotspots

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/hotspots")
def hotspots():
    return generate_hotspots()