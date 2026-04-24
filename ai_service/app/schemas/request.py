from pydantic import BaseModel
from fastapi import UploadFile

class SeverityRequest(BaseModel):
    text: str

class ImageRequest(BaseModel):
    image: UploadFile

class FirstAidRequest(BaseModel):
    issue: str

class DuplicateRequest(BaseModel):
    text: str
    location: str

class FullReportRequest(BaseModel):
    text: str
    location: str
    username: str