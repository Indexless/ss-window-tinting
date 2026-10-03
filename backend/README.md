# S&S Window Tinting Backend

Go clean-architecture API with MySQL and HttpOnly JWT cookies.

## Run

```bash
cp .env.example .env
go run ./cmd/server
```

API: `http://localhost:8080`

## Dummy account

| Field    | Value                       |
|----------|-----------------------------|
| Email    | `admin@sswindowtinting.com` |
| Password | `password123`               |

## Endpoints

| Method | Path                 | Auth   | Notes                          |
|--------|----------------------|--------|--------------------------------|
| GET    | `/health`            | No     |                                |
| GET    | `/api/v1/config`     | No     | Public site settings           |
| PATCH  | `/api/v1/config`     | Cookie | Update editable settings       |
| POST   | `/api/v1/auth/login` | No     | Sets `ss_access` / `ss_refresh`|
| POST   | `/api/v1/auth/refresh` | Cookie | Rotates cookies              |
| POST   | `/api/v1/auth/logout`  | Cookie | Clears cookies               |
| GET    | `/api/v1/auth/me`      | Cookie | Current user                 |

Editable config fields live in MySQL `site_config` (WhatsApp, phone, email, Instagram, SEO, etc.).
