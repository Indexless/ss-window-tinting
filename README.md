# S&S Window Tinting

```
s&swindowtinting/
├── frontend/   React (components-first) + custom routing/
└── backend/    Go clean arch + MySQL + HttpOnly JWT cookies
```

## Quick start

### Backend

```bash
cd backend
go run ./cmd/server
```

### Frontend

```bash
cd frontend
cp .env.example .env   # optional for local; leave VITE_API_BASE_URL empty
npm run dev
```

- Site: http://localhost:5173  
- API: http://localhost:8080  
- Admin: http://localhost:5173/?login=1 (`admin@sswindowtinting.com` / `password123`)
- Locally the Vite proxy forwards `/api` and `/uploads` to the backend, so no frontend API URL is required until production.

## Architecture notes

- **Frontend:** pages compose components; routes live in `src/routing/`
- **Auth:** JWT in HttpOnly cookies (`ss_access`, `ss_refresh`) via `credentials: 'include'`
- **Config:** contact/social/SEO values come from `GET /api/v1/config` (MySQL), editable in admin
- **Logos:** `frontend/public/logo.png` (transparent) and `logo-dark.png` (black bg)
