package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"

	"snswindowtinting/backend/internal/delivery/http/response"
	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/usecase"
)

type LeadsHandler struct {
	Leads *usecase.LeadsUseCase
}

func (h *LeadsHandler) List(w http.ResponseWriter, r *http.Request) {
	leads, err := h.Leads.List()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "LEADS_ERROR", "Could not load leads")
		return
	}
	response.OK(w, leads)
}

func (h *LeadsHandler) CreatePublic(w http.ResponseWriter, r *http.Request) {
	var body domain.CreateLeadInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	lead, err := h.Leads.CreateFromWebsite(body)
	if err != nil {
		if errors.Is(err, domain.ErrValidation) {
			msg := "Name, a phone or email, and privacy consent are required"
			if !body.PrivacyConsent {
				msg = "Please accept the privacy notice to submit your quote request"
			}
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", msg)
			return
		}
		response.Error(w, http.StatusInternalServerError, "LEADS_ERROR", "Could not submit request")
		return
	}
	response.OK(w, map[string]string{"id": lead.ID})
}

func (h *LeadsHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body domain.CreateLeadInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	lead, err := h.Leads.CreateManual(body)
	if err != nil {
		if errors.Is(err, domain.ErrValidation) {
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Name and a phone or email are required")
			return
		}
		response.Error(w, http.StatusInternalServerError, "LEADS_ERROR", "Could not create lead")
		return
	}
	response.OK(w, lead)
}

func (h *LeadsHandler) Update(w http.ResponseWriter, r *http.Request) {
	var body domain.UpdateLeadInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}

	lead, err := h.Leads.Update(chi.URLParam(r, "id"), body)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrValidation):
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid lead details")
		case errors.Is(err, domain.ErrNotFound):
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Lead not found")
		default:
			response.Error(w, http.StatusInternalServerError, "LEADS_ERROR", "Could not update lead")
		}
		return
	}
	response.OK(w, lead)
}
