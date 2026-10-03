# S&S Window Tinting Frontend

Components-first React app with a dedicated `src/routing/` folder.

## Structure

```
src/
  routing/          AppRouter, routes, ProtectedRoute
  pages/            Thin page composition
  components/
    layout/         Header, Footer, MobileCtaBar
    home/           Marketing sections
    contact/        WhatsAppFloat
    brand/          Logo
    ui/             Reveal, Lightbox
  providers/        SiteConfigProvider, AuthProvider
  api/              HTTP client (credentials: include)
```

## Run

```bash
npm install
npm run dev
```

Editable contact/social values come from `GET /api/v1/config` (MySQL). Update them in `/admin` after login.
