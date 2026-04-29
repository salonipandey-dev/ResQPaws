from fastapi import FastAPI
from app.routers import severity

app = FastAPI(title="ResQPaws Severity API")

app.include_router(severity.router)

@app.get("/")
def home():
    return {"message": "ResQPaws Severity API Live"}

@app.get("/health")
def health():
    return {"status": "healthy"}