# 🐾 ResQPaws Backend API

Urban Animal Rescue Platform — Node.js + Express + MongoDB

---

## Setup

```bash
cd resqpaws
npm install
cp .env.example .env   # fill in your values
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CLOUDINARY_CLOUD_NAME` | From cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Your React frontend URL |

---

## Roles

| Role | Permissions |
|---|---|
| `citizen` | Report cases, view own cases, feedback |
| `volunteer` | View/update assigned cases (must be verified) |
| `ngo` | View all cases, assign teams, update status (must be verified) |
| `admin` | Full access + dashboard analytics + user management |

---

## API Endpoints

### Auth `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register (citizen/volunteer/ngo) |
| POST | `/login` | ❌ | Login, returns JWT |
| GET | `/me` | ✅ | Get current user profile |
| PUT | `/change-password` | ✅ | Change password |

#### Register Body
```json
{
  "name": "Saloni Pandey",
  "email": "saloni@email.com",
  "password": "secret123",
  "role": "citizen",
  "phone": "+919305934947",
  "city": "Mathura",
  "state": "Uttar Pradesh"
}
```

#### NGO Register (additional fields)
```json
{
  "role": "ngo",
  "organizationName": "Paws Rescue Foundation",
  "registrationNumber": "NGO-UP-2024-001"
}
```

---

### Rescue Cases `/api/cases`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/` | ✅ | Any | Report new rescue case (multipart/form-data) |
| GET | `/` | ✅ | Any | List cases (filtered by role) |
| GET | `/nearby` | ✅ | Any | Cases near coordinates |
| GET | `/:id` | ✅ | Any | Get single case detail |
| PATCH | `/:id/status` | ✅ | ngo/volunteer/admin | Update case status |
| POST | `/:id/media` | ✅ | Reporter/Assigned | Add more media |
| POST | `/:id/feedback` | ✅ | Reporter | Rate the rescue |
| DELETE | `/:id` | ✅ | admin | Delete case |

#### Report a Case (multipart/form-data)
```
animalType    : dog | cat | bird | cow | monkey | reptile | other
description   : "Injured dog near main market, bleeding from leg"
urgencyLevel  : low | medium | high | critical
latitude      : 27.4924
longitude     : 77.6737
address       : "Near Gandhi Chowk, Mathura"
landmark      : "Opposite SBI Bank"
city          : Mathura
conditionTags : ["injured","bleeding"]   (JSON string)
media         : [files] (up to 5 images/videos)
```

#### Case Status Workflow
```
reported → verified → accepted → on_the_way → rescued → closed
         ↘ rejected              (at any pre-rescued stage)
```

#### Update Status Body
```json
{
  "status": "accepted",
  "note": "Team dispatched from NGO HQ",
  "assignTo": "<volunteer_user_id>"
}
```

---

### Users `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leaderboard` | ✅ | Top rescuers by points |
| GET | `/:id` | ✅ | Public profile of any user |
| PUT | `/profile` | ✅ | Update own profile |
| POST | `/avatar` | ✅ | Upload profile avatar |
| GET | `/:id/rewards` | ✅ | Reward & badge history |

#### Leaderboard Query Params
```
?city=Mathura&state=UP&limit=10
```

---

### Admin `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Full analytics: cases, hotspots, trends |
| GET | `/users` | List all users with filters |
| PATCH | `/users/:id/verify` | Verify NGO/volunteer accounts |
| PATCH | `/users/:id/deactivate` | Activate/deactivate accounts |
| PATCH | `/users/:id/role` | Change user role |

#### Dashboard Response Includes
- Summary: total users, cases, rescue rate, avg response time
- Cases by status and animal type
- Rescue hotspots (top cities)
- Monthly trend for last 6 months
- Critical pending cases

---

## Gamification Points

| Action | Points |
|---|---|
| Report a case | +10 |
| Case gets rescued | +25 (reporter), +50 (responder) |
| First rescue report | +100 (bonus) |
| 10 reports milestone | +75 (bonus) |
| Daily login | +5 |
| Fake report penalty | −30 |

## Badges

| Badge | Trigger |
|---|---|
| 🐾 First Responder | First rescue report |
| 🦸 Rescue Hero | 10 reports submitted |
| 🛡️ Animal Guardian | 50 reports submitted |
| 🏆 Top Rescuer | Admin-awarded for leaderboard rank |
| ⭐ Profile Star | Complete profile on registration |

---

## Geo Search

Cases are geo-indexed. Use nearby endpoint:
```
GET /api/cases/nearby?lat=27.49&lng=77.67&radius=5
```
`radius` is in kilometers.

---

## AI/NLP Integration (Future Python Microservice)

The backend has reserved fields for AI output:
- `aiSeverityScore` — 0-100 score from vision/NLP model
- `aiConditionExtracted` — conditions auto-extracted from description
- `translatedDescription` — multilingual map `{ hi: "...", ta: "..." }`
- `firstAidGuidance` — RAG-generated first-aid steps
- `isDuplicate` / `duplicateOf` — duplicate detection flags

Connect your FastAPI/Flask AI service to populate these fields via internal API calls.
