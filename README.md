# Finance Dashboard — Spring Boot + React

Monorepo with a **Spring Boot** REST API (`backend/`) and a **React (Vite + TypeScript)** UI (`frontend/`), integrated via JWT authentication and CORS/proxy.

## Assumptions

- **Roles**: `VIEWER` (dashboard summaries + recent activity **without notes**), `ANALYST` (read/search financial records + all dashboard APIs), `ADMIN` (full record CRUD + user management).
- **Persistence**: MySQL database `finance_db` running on `localhost:3306` (created on first run).
- **Auth**: JWT in `Authorization: Bearer <token>`; demo users seeded on first startup (see below).
- **Production**: Change `app.jwt.secret` in `backend/src/main/resources/application.properties` and configure `VITE_API_URL` for the frontend build if the API is on another origin.

## Prerequisites

- Java 17+, Maven 3.8+
- Node.js 20+ (npm)

## Run the backend

```bash
cd backend
mvn spring-boot:run
```

API base: `http://localhost:8080`

### Demo users (seeded once)

| Username | Password   | Role    |
|----------|------------|---------|
| admin    | admin123   | ADMIN   |
| analyst  | analyst123 | ANALYST |
| viewer   | viewer123  | VIEWER  |

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server **proxies** `/api` to `http://localhost:8080`, so you do not need `VITE_API_URL` for local development.

### Production-style frontend build

```bash
cd frontend
VITE_API_URL=http://localhost:8080 npm run build
npm run preview
```

Point `VITE_API_URL` at your deployed API origin.

## API overview

| Area        | Method & path | Roles |
|-------------|---------------|-------|
| Auth        | `POST /api/auth/login`, `GET /api/auth/me` | Public / authenticated |
| Dashboard   | `GET /api/dashboard/summary`, `/categories`, `/trends`, `/recent` | Authenticated |
| Records     | `GET /api/records` (filters: `from`, `to`, `category`, `type`, `q`, `page`, `size`) | ANALYST, ADMIN |
| Records     | `POST/PUT/DELETE /api/records` | ADMIN |
| Users       | `GET/POST /api/users`, `PATCH .../role`, `PATCH .../status` | ADMIN |

Errors return JSON with `status`, `message`, and optional `details` (validation).

## Project layout

```
backend/     — Spring Boot, JPA, Spring Security, JWT, MYSQL
frontend/    — React, React Router, Tailwind CSS, Recharts
```

## Tradeoffs

- Aggregations for the dashboard load all records in memory; fine for demos and moderate data. For large datasets, move summaries to SQL/scheduled jobs/materialized views.
- JWT secret is in `application.properties` for simplicity; use env vars or a secret manager in production.

  ## Assumption Made
- VIEWER role can see dashboard and recent activity but cannot see record notes
- ANALYST can search and filter records but cannot modify them
- ADMIN is the only role that can create, update, or delete records and manage users
- Demo users are seeded automatically on first startup
- JWT tokens are stateless with no refresh token mechanism
- Dashboard aggregations run in memory (suitable for demo scale data)
