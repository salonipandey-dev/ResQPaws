# ResQPaws AI Service

FastAPI microservice for:
- severity prediction
- duplicate report detection
- first-aid guidance
- health checks

## Local Run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Required Endpoints

- `GET /health/`
- `POST /severity/predict`
- `POST /duplicate/check`
- `POST /firstaid/help`
