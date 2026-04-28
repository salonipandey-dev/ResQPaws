from fastapi import FastAPI
from app.routers import health , severity ,vision , firstaid  , analytics , reports





app = FastAPI(
    title="ResQPaws AI Service",
    version="1.0.0",
    description="AI Engine for animal rescue coordination"
)

app.include_router(health.router)
app.include_router(severity.router)
app.include_router(vision.router)
app.include_router(firstaid.router)

app.include_router(analytics.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {
        "message": "ResQPaws AI Running"
    }