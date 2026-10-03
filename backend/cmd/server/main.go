package main

import (
	"log"
	"net/http"
	"path/filepath"

	"snswindowtinting/backend/internal/config"
	"snswindowtinting/backend/internal/database"
	httpdelivery "snswindowtinting/backend/internal/delivery/http"
	"snswindowtinting/backend/internal/migrate"
	"snswindowtinting/backend/internal/pkg/token"
	"snswindowtinting/backend/internal/repository"
	"snswindowtinting/backend/internal/usecase"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	if err := migrate.Up(db, filepath.Join("migrations")); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	userRepo := repository.NewMySQLUserRepository(db)
	refreshRepo := repository.NewMySQLRefreshRepository(db)
	configRepo := repository.NewMySQLSiteConfigRepository(db)
	leadRepo := repository.NewMySQLLeadRepository(db)
	galleryRepo := repository.NewMySQLGalleryRepository(db)

	tokenManager := token.NewManager(cfg.JWTAccessSecret, cfg.JWTAccessTTL, cfg.JWTRefreshTTL)
	authUC := usecase.NewAuthUseCase(userRepo, refreshRepo, tokenManager)
	configUC := usecase.NewSiteConfigUseCase(configRepo)
	usersUC := usecase.NewUsersUseCase(userRepo)
	leadsUC := usecase.NewLeadsUseCase(leadRepo)
	galleryUC := usecase.NewGalleryUseCase(galleryRepo, cfg.UploadDir, cfg.PublicBaseURL)
	portalUC := usecase.NewPortalUseCase(userRepo, refreshRepo, configRepo)

	router := httpdelivery.NewRouter(httpdelivery.Deps{
		Auth:           authUC,
		SiteConfig:     configUC,
		Users:          usersUC,
		Leads:          leadsUC,
		Gallery:        galleryUC,
		Portal:         portalUC,
		CookieSecure:   cfg.CookieSecure,
		FrontendOrigin: cfg.FrontendOrigin,
		CORSOrigins:    cfg.CORSOrigins,
		UploadDir:      cfg.UploadDir,
	})

	log.Printf("S&S Window Tinting API listening on %s", cfg.Addr)
	log.Printf("Dummy login: admin@sswindowtinting.co.za / s@ndsAdmin")
	if err := http.ListenAndServe(cfg.Addr, router); err != nil {
		log.Fatal(err)
	}
}
