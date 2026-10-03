package handler

import (
	"net/http"

	"snswindowtinting/backend/internal/delivery/http/response"
	"snswindowtinting/backend/internal/usecase"
)

type PortalHandler struct {
	Portal *usecase.PortalUseCase
}

func (h *PortalHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	stats, err := h.Portal.Dashboard()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "DASHBOARD_ERROR", "Could not load dashboard")
		return
	}
	response.OK(w, stats)
}

func (h *PortalHandler) PurgeSessions(w http.ResponseWriter, r *http.Request) {
	report, err := h.Portal.PurgeSessions()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "HOUSEKEEPING_ERROR", "Could not purge sessions")
		return
	}
	response.OK(w, report)
}
