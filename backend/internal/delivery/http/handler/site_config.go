package handler

import (
	"encoding/json"
	"net/http"

	"snswindowtinting/backend/internal/delivery/http/response"
	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/usecase"
)

type SiteConfigHandler struct {
	Config *usecase.SiteConfigUseCase
}

func (h *SiteConfigHandler) Get(w http.ResponseWriter, r *http.Request) {
	cfg, err := h.Config.Get()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "CONFIG_ERROR", "Could not load site config")
		return
	}
	response.OK(w, cfg)
}

func (h *SiteConfigHandler) Update(w http.ResponseWriter, r *http.Request) {
	var body domain.SiteConfigUpdate
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	cfg, err := h.Config.Update(body)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "CONFIG_ERROR", "Could not update site config")
		return
	}
	response.OK(w, cfg)
}
