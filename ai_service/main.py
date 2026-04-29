from fastapi import FastAPI

app = FastAPI(title="ResQPaws Severity API")

@app.get("/")
def home():
    return {"message": "ResQPaws API Live"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/ping")
def ping():
    return {"ping": "pong"}