from typing import List
from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    service: str
    time: str

class SeverityResponse(BaseModel):
    input_text: str
    score: int
    priority: str
    confidence: float
    reasons: List[str]