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
	CORSOrigins      []string
	UploadDir        string
	PublicBaseURL    string
}

func Load() Config {
	_ = godotenv.Load()

	frontendOrigin := env("FRONTEND_ORIGIN", "http://localhost:5173")
	return Config{
		Addr:             env("ADDR", ":8080"),
		DatabaseURL:      NormalizeMySQLDSN(env("DATABASE_URL", "mysql://root:password@localhost:3306/ss_window_tinting")),
		JWTAccessSecret:  env("JWT_ACCESS_SECRET", "ss-window-tinting-dev-access-secret"),
		JWTRefreshSecret: env("JWT_REFRESH_SECRET", "ss-window-tinting-dev-refresh-secret"),
		JWTAccessTTL:     time.Hour,
		JWTRefreshTTL:    7 * 24 * time.Hour,
		CookieSecure:     boolEnv("COOKIE_SECURE", false),
		FrontendOrigin:   frontendOrigin,
		CORSOrigins:      loadCORSOrigins(frontendOrigin),
		UploadDir:        env("UPLOAD_DIR", "uploads"),
		PublicBaseURL:    strings.TrimRight(env("PUBLIC_BASE_URL", ""), "/"),
	}
}

func loadCORSOrigins(frontendOrigin string) []string {
	// CORS_ORIGINS takes precedence (comma-separated). FRONTEND_ORIGIN is always included.
	raw := env("CORS_ORIGINS", "")
	seen := map[string]struct{}{}
	var out []string

	add := func(origin string) {
		origin = strings.TrimSpace(origin)
		if origin == "" {
			return
		}
		if _, ok := seen[origin]; ok {
			return
		}
		seen[origin] = struct{}{}
		out = append(out, origin)
	}

	for _, part := range strings.Split(raw, ",") {
		add(part)
	}
	add(frontendOrigin)
	// Local Vite defaults (credentials-friendly; cannot use *)
	add("http://localhost:5173")
	add("http://127.0.0.1:5173")

	if len(out) == 0 {
		add("http://localhost:5173")
	}
	return out
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
