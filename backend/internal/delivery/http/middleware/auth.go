package middleware

import (
	"context"
	"net/http"
	"strings"

	"snswindowtinting/backend/internal/delivery/http/cookies"
	"snswindowtinting/backend/internal/delivery/http/response"
	"snswindowtinting/backend/internal/pkg/token"
	"snswindowtinting/backend/internal/usecase"
)

type claimsKey struct{}

func ClaimsFromContext(ctx context.Context) (*token.Claims, bool) {
	claims, ok := ctx.Value(claimsKey{}).(*token.Claims)
	return claims, ok
}

func RequireAuth(auth *usecase.AuthUseCase) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			access := accessTokenFromRequest(r)
			if access == "" {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated")
				return
			}

			claims, err := auth.ParseAccess(access)
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid or expired token")
				return
			}

			ctx := context.WithValue(r.Context(), claimsKey{}, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func accessTokenFromRequest(r *http.Request) string {
	if cookie := cookies.Value(r, cookies.AccessCookie); cookie != "" {
		return cookie
	}
	header := r.Header.Get("Authorization")
	if strings.HasPrefix(header, "Bearer ") {
		return strings.TrimPrefix(header, "Bearer ")
	}
	return ""
}
