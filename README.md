# ResQPaws 🐾

### Turn an animal sighting into a structured rescue report.

ResQPaws is a student-built animal rescue coordination prototype by **Saloni Pandey**. It brings photo and location reporting, case tracking, and an experimental Python triage service into one full-stack project.

**[Explore the code](frontend/src) · [Architecture & limitations](docs/ARCHITECTURE.md) · [Demo walkthrough](#try-the-interactive-demo)**

![Next.js](https://img.shields.io/badge/Next.js-14-111827?logo=nextdotjs) ![TypeScript](https://img.shields.io/badge/TypeScript-frontend-3178C6?logo=typescript&logoColor=white) ![Express](https://img.shields.io/badge/Express-API-454545?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-persistence-47A248?logo=mongodb&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-experimental_AI-009688?logo=fastapi&logoColor=white)

## The problem

Animal rescue information is often scattered across calls and messages. Responders need a clear description, a photo, and a location; reporters need a way to follow up. This project explores a shared, structured workflow for those needs.

## Try the interactive demo

The frontend includes a **no-login demo at `/demo`**, with fictional cases and session-only state. No rescue is dispatched.

```bash
git clone https://github.com/salonipandey-dev/ResQPaws.git
cd ResQPaws/frontend
npm ci
npm run dev
```

Open **http://localhost:3000/demo**. Search by animal or location, filter the queue, select a case, and simulate its progression from reported to closed. Summary cards update as you move cases forward. Reset restores the examples. This route works without MongoDB or the Python service.

## What is implemented?

| Area | Current implementation |
| --- | --- |
| Public website | Responsive landing page, theme toggle, about/contact screens |
| Interactive demo | Search, status filters, case selection, timeline simulation, derived summary metrics |
| Authentication | Registration, login, separate admin login, JWT middleware, password hashing |
| Citizen reporting | Authenticated photo/location report creation and MongoDB persistence |
| Tracking | Authenticated report history and summary endpoints |
| Case access | Detail access restricted to the reporter, assigned responder, or admin |
| Uploads | Local disk storage; optional Cloudinary configuration |
| Python assistance | Text severity classifier, duplicate checks, and first-aid guidance endpoints |
| NGO/admin dashboards | Prototype interfaces; complete assignment and status APIs are future work |

**Project status:** development prototype. No verified NGO network, production dispatch system, or measured rescue impact is claimed. AI output is experimental, without a published evaluation dataset or accuracy benchmark. It must not replace professional assessment.

## Run the full stack

Prerequisites: Node.js 20+, npm, Python 3.11 (recommended for the pinned ML dependencies), and MongoDB.

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI` and a long random `JWT_SECRET`. Cloudinary is optional; without it, uploads are stored locally.
2. Copy `frontend/.env.local.example` to `frontend/.env.local`. Browser requests use `/api`; the Next.js server forwards them to `BACKEND_API_URL`.
3. Start each service in a separate terminal:

**Backend**
```bash
cd backend
npm ci
npm run dev
```

**Python service**
```bash
cd ai_service
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:3000. Backend health: http://localhost:5000/health. Python API documentation: http://localhost:8000/docs.

If the Python service is unavailable, report creation uses the existing fallback priority and has no AI guidance. That fallback is not a clinical assessment. Real reports require MongoDB and a running backend.

## Engineering decisions

- **Separate services:** Next.js handles the interface, Express handles accounts and persistence, and FastAPI isolates Python inference.
- **Same-origin proxy:** browsers call `/api`, avoiding hard-coded localhost endpoints on a deployed frontend. The proxy forwards query parameters and provides a controlled unavailable-service response.
- **Geospatial data:** rescue locations use GeoJSON coordinates in `[longitude, latitude]` order.
- **Graceful assistance failure:** AI calls use timeouts and `Promise.allSettled`, so an unavailable assistant does not prevent a report from being recorded.
- **Honest demo:** sample data is labeled and isolated from real rescue records.

## Checks

```bash
cd frontend
npm run typecheck
npm run build
# From repository root:
node --test backend/tests/case-access.test.js
```

## Next milestones

- Implement and test NGO assignment, status transitions, and ownership rules.
- Add real end-to-end tests with an isolated MongoDB database.
- Evaluate severity classification on a documented held-out dataset.
- Add verified partner onboarding, upload hardening, and retention controls before handling real community reports.
- Deploy the services and add a live demo link and screenshots after verification.

See [architecture notes](docs/ARCHITECTURE.md) for API boundaries and deployment considerations.
