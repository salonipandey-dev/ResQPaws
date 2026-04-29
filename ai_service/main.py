import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.duplicate import router as duplicate_router
from app.routers.firstaid import router as firstaid_router
from app.routers.health import router as health_router
from app.routers.severity import router as severity_router

app = FastAPI(
    title="ResQPaws AI Service",
    version="1.0.0",
    redirect_slashes=False,  # <-- ADD THIS LINE — kills the 307 redirect
)

default_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
env_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
allowed_origins = list(set(default_origins + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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