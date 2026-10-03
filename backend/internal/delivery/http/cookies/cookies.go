package cookies

import (
	"net/http"
	"time"
)

const (
	AccessCookie  = "ss_access"
	RefreshCookie = "ss_refresh"
)

type Settings struct {
	Secure bool
}

func SetAuth(w http.ResponseWriter, access, refresh string, accessTTL, refreshTTL time.Duration, settings Settings) {
	http.SetCookie(w, &http.Cookie{
		Name:     AccessCookie,
		Value:    access,
		Path:     "/",
		HttpOnly: true,
		Secure:   settings.Secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int(accessTTL.Seconds()),
	})
	http.SetCookie(w, &http.Cookie{
		Name:     RefreshCookie,
		Value:    refresh,
		Path:     "/api/v1/auth",
		HttpOnly: true,
		Secure:   settings.Secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int(refreshTTL.Seconds()),
	})
}

func ClearAuth(w http.ResponseWriter, settings Settings) {
	base := http.Cookie{
		Value:    "",
		HttpOnly: true,
		Secure:   settings.Secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	}

	access := base
	access.Name = AccessCookie
	access.Path = "/"
	http.SetCookie(w, &access)

	refresh := base
	refresh.Name = RefreshCookie
	refresh.Path = "/api/v1/auth"
	http.SetCookie(w, &refresh)
}

func Value(r *http.Request, name string) string {
	c, err := r.Cookie(name)
	if err != nil {
		return ""
	}
	return c.Value
}
