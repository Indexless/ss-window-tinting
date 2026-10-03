package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"snswindowtinting/backend/internal/delivery/http/middleware"
	"snswindowtinting/backend/internal/delivery/http/response"
	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/usecase"
)

type UsersHandler struct {
	Users *usecase.UsersUseCase
}

func (h *UsersHandler) List(w http.ResponseWriter, r *http.Request) {
	users, err := h.Users.List()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "USERS_ERROR", "Could not list users")
		return
	}
	response.OK(w, users)
}

func (h *UsersHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body domain.CreateUserInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	user, err := h.Users.Create(body)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrValidation):
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Name, email and password (min 8 chars) are required")
		case errors.Is(err, domain.ErrConflict):
			response.Error(w, http.StatusConflict, "CONFLICT", "A user with that email already exists")
		default:
			response.Error(w, http.StatusInternalServerError, "USERS_ERROR", "Could not create user")
		}
		return
	}
	response.OK(w, user)
}

type setActiveRequest struct {
	IsActive bool `json:"isActive"`
}

func (h *UsersHandler) SetActive(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated")
		return
	}

	var body setActiveRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	user, err := h.Users.SetActive(chi.URLParam(r, "id"), claims.Subject, body.IsActive)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You cannot deactivate your own account")
		case errors.Is(err, domain.ErrNotFound):
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "User not found")
		default:
			response.Error(w, http.StatusInternalServerError, "USERS_ERROR", "Could not update user")
		}
		return
	}
	response.OK(w, user)
}

func (h *UsersHandler) Update(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.ClaimsFromContext(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Not authenticated")
		return
	}

	var body domain.UpdateUserInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	user, err := h.Users.Update(chi.URLParam(r, "id"), claims.Subject, body)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrValidation):
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid user details")
		case errors.Is(err, domain.ErrConflict):
			response.Error(w, http.StatusConflict, "CONFLICT", "A user with that email already exists")
		case errors.Is(err, domain.ErrForbidden):
			response.Error(w, http.StatusForbidden, "FORBIDDEN", "You cannot deactivate your own account")
		case errors.Is(err, domain.ErrNotFound):
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "User not found")
		default:
			response.Error(w, http.StatusInternalServerError, "USERS_ERROR", "Could not update user")
		}
		return
	}
	response.OK(w, user)
}
