# ResQPaws Frontend (React + Tailwind)

This repository now includes a production-ready frontend foundation using React, Vite, and Tailwind CSS.

## Run Locally

1. Install Node.js LTS (v18+ recommended).
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Implemented Frontend Modules

- Role-based auth UI: User, NGO, Volunteer
- Signup, login, forgot/reset password flow
- Emergency report submission with:
  - condition, details, media upload fields
  - language selector
  - location capture hook
  - AI severity + first-aid helper (frontend heuristic)
  - duplicate-report warning
- User dashboard:
  - report status tracking
  - rewards, badges, and shareable impact text
- NGO dashboard:
  - urgent/nearby/completed filters
  - status progression: Reported -> Verified -> Accepted -> On the Way -> Rescued -> Closed

## Demo Accounts

- User: `user@resqpaws.org` / `password123`
- NGO: `ngo@resqpaws.org` / `password123`

## Notes

- Data is persisted in browser `localStorage` via service layer (`src/services/storage.js`).
- Map/API/AI integrations are prepared as frontend hooks and can be wired to backend services next.
