from fastapi import FastAPI

from app.routers.duplicate import router as duplicate_router
from app.routers.firstaid import router as firstaid_router
from app.routers.health import router as health_router
from app.routers.severity import router as severity_router

app = FastAPI(title="ResQPaws AI Service", version="1.0.0")


@app.get("/")
def home():
    return {"message": "ResQPaws AI Service Live"}


@app.get("/ping")
def ping():
    return {"ping": "pong"}


app.include_router(health_router)
app.include_router(severity_router)
app.include_router(duplicate_router)
app.include_router(firstaid_router)
