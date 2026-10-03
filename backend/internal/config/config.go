package config

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Addr             string
	DatabaseURL      string
	JWTAccessSecret  string
	JWTRefreshSecret string
	JWTAccessTTL     time.Duration
	JWTRefreshTTL    time.Duration
	CookieSecure     bool
	FrontendOrigin   string
	UploadDir        string
	PublicBaseURL    string
}

func Load() Config {
	_ = godotenv.Load()

	return Config{
		Addr:             env("ADDR", ":8080"),
		DatabaseURL:      NormalizeMySQLDSN(env("DATABASE_URL", "mysql://root:password@localhost:3306/ss_window_tinting")),
		JWTAccessSecret:  env("JWT_ACCESS_SECRET", "ss-window-tinting-dev-access-secret"),
		JWTRefreshSecret: env("JWT_REFRESH_SECRET", "ss-window-tinting-dev-refresh-secret"),
		JWTAccessTTL:     time.Hour,
		JWTRefreshTTL:    7 * 24 * time.Hour,
		CookieSecure:     boolEnv("COOKIE_SECURE", false),
		FrontendOrigin:   env("FRONTEND_ORIGIN", "http://localhost:5173"),
		UploadDir:        env("UPLOAD_DIR", "uploads"),
		PublicBaseURL:    strings.TrimRight(env("PUBLIC_BASE_URL", ""), "/"),
	}
}

func env(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}

func boolEnv(key string, fallback bool) bool {
	raw := strings.TrimSpace(os.Getenv(key))
	if raw == "" {
		return fallback
	}
	v, err := strconv.ParseBool(raw)
	if err != nil {
		return fallback
	}
	return v
}
