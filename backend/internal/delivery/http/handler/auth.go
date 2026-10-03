package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"snswindowtinting/backend/internal/delivery/http/cookies"
	"snswindowtinting/backend/internal/delivery/http/middleware"
	"snswindowtinting/backend/internal/delivery/http/response"
	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/usecase"
)

type AuthHandler struct {
	Auth    *usecase.AuthUseCase
	Cookies cookies.Settings
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var body loginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	auth, profile, err := h.Auth.Login(strings.TrimSpace(body.Email), body.Password)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrAccountInactive):
			response.Error(w, http.StatusForbidden, "ACCOUNT_INACTIVE", "Account is inactive")
		default:
			response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid credentials")
		}
		return
	}

	cookies.SetAuth(w, auth.AccessToken, auth.RefreshToken, h.Auth.AccessTTL(), h.Auth.RefreshTTL(), h.Cookies)
	response.OK(w, map[string]any{"user": profile})
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	refreshToken := cookies.Value(r, cookies.RefreshCookie)
	auth, err := h.Auth.Refresh(refreshToken)
	if err != nil {
		cookies.ClearAuth(w, h.Cookies)
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid refresh token")
		return
	}

	cookies.SetAuth(w, auth.AccessToken, auth.RefreshToken, h.Auth.AccessTTL(), h.Auth.RefreshTTL(), h.Cookies)
	response.OK(w, map[string]bool{"ok": true})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	refreshToken := cookies.Value(r, cookies.RefreshCookie)
	h.Auth.Logout(refreshToken)
	cookies.ClearAuth(w, h.Cookies)
	response.OK(w, map[string]bool{"ok": true})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated")
		return
	}

	profile, err := h.Auth.Me(claims.Subject)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated")
		return
	}
	response.OK(w, profile)
}
