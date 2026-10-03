package httpdelivery

import (
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"snswindowtinting/backend/internal/delivery/http/cookies"
	"snswindowtinting/backend/internal/delivery/http/handler"
	"snswindowtinting/backend/internal/delivery/http/middleware"
	"snswindowtinting/backend/internal/delivery/http/response"
	"snswindowtinting/backend/internal/usecase"
)

type Deps struct {
	Auth           *usecase.AuthUseCase
	SiteConfig     *usecase.SiteConfigUseCase
	Users          *usecase.UsersUseCase
	Leads          *usecase.LeadsUseCase
	Gallery        *usecase.GalleryUseCase
	Portal         *usecase.PortalUseCase
	CookieSecure   bool
	FrontendOrigin string
	UploadDir      string
}

func NewRouter(deps Deps) http.Handler {
	r := chi.NewRouter()
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(chimw.Timeout(60 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{deps.FrontendOrigin, "http://127.0.0.1:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	cookieSettings := cookies.Settings{Secure: deps.CookieSecure}
	authHandler := &handler.AuthHandler{Auth: deps.Auth, Cookies: cookieSettings}
	configHandler := &handler.SiteConfigHandler{Config: deps.SiteConfig}
	usersHandler := &handler.UsersHandler{Users: deps.Users}
	leadsHandler := &handler.LeadsHandler{Leads: deps.Leads}
	galleryHandler := &handler.GalleryHandler{Gallery: deps.Gallery}
	portalHandler := &handler.PortalHandler{Portal: deps.Portal}

	_ = os.MkdirAll(filepath.Join(deps.UploadDir, "gallery"), 0o755)
	fileServer := http.StripPrefix("/uploads/", http.FileServer(http.Dir(deps.UploadDir)))
	r.Handle("/uploads/*", fileServer)

	r.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		response.OK(w, map[string]string{"status": "ok"})
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/config", configHandler.Get)
		r.Post("/leads", leadsHandler.CreatePublic)
		r.Get("/gallery", galleryHandler.ListPublic)

		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", authHandler.Login)
			r.Post("/refresh", authHandler.Refresh)
			r.Post("/logout", authHandler.Logout)

			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireAuth(deps.Auth))
				r.Get("/me", authHandler.Me)
			})
		})

		r.Group(func(r chi.Router) {
			r.Use(middleware.RequireAuth(deps.Auth))

			r.Get("/portal/dashboard", portalHandler.Dashboard)

			r.Get("/users", usersHandler.List)
			r.Post("/users", usersHandler.Create)
			r.Patch("/users/{id}", usersHandler.Update)
			r.Patch("/users/{id}/active", usersHandler.SetActive)

			r.Get("/leads", leadsHandler.List)
			r.Post("/leads/manual", leadsHandler.Create)
			r.Patch("/leads/{id}", leadsHandler.Update)

			r.Get("/gallery/admin", galleryHandler.ListAdmin)
			r.Post("/gallery", galleryHandler.Upload)
			r.Patch("/gallery/reorder", galleryHandler.Reorder)
			r.Patch("/gallery/{id}", galleryHandler.Update)
			r.Delete("/gallery/{id}", galleryHandler.Delete)

			r.Put("/config", configHandler.Update)
			r.Patch("/config", configHandler.Update)
		})
	})

	return r
}
