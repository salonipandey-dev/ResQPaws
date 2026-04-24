from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.vision_service import analyze_image

router = APIRouter(prefix="/vision", tags=["Vision"])

UPLOAD_DIR = "data/raw"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/detect")
async def detect_image(image: UploadFile = File(...)):

    file_path = f"{UPLOAD_DIR}/{image.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    result = analyze_image(file_path)

    return {
        "filename": image.filename,
        "result": result
    }