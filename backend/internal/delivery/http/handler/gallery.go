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

type GalleryHandler struct {
	Gallery *usecase.GalleryUseCase
}

func (h *GalleryHandler) ListPublic(w http.ResponseWriter, r *http.Request) {
	items, err := h.Gallery.ListPublic()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not load gallery")
		return
	}
	response.OK(w, items)
}

func (h *GalleryHandler) ListAdmin(w http.ResponseWriter, r *http.Request) {
	items, err := h.Gallery.ListAdmin()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not load gallery")
		return
	}
	response.OK(w, items)
}

func (h *GalleryHandler) Upload(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(usecase.MaxGalleryImageBytes + (1 << 20)); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid upload")
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Image file is required")
		return
	}
	defer file.Close()

	data, err := usecase.ReadUploadFile(file)
	if err != nil {
		if errors.Is(err, domain.ErrValidation) {
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", err.Error())
			return
		}
		response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not read upload")
		return
	}

	alt := r.FormValue("alt")
	item, err := h.Gallery.Upload(header.Filename, data, alt)
	if err != nil {
		if errors.Is(err, domain.ErrValidation) {
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", err.Error())
			return
		}
		response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not upload image")
		return
	}
	response.OK(w, item)
}

func (h *GalleryHandler) Update(w http.ResponseWriter, r *http.Request) {
	var body domain.UpdateGalleryImageInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}
	item, err := h.Gallery.Update(chi.URLParam(r, "id"), body)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrNotFound):
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Image not found")
		default:
			response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not update image")
		}
		return
	}
	response.OK(w, item)
}

func (h *GalleryHandler) Reorder(w http.ResponseWriter, r *http.Request) {
	var body domain.ReorderGalleryInput
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Invalid JSON body")
		return
	}
	if err := h.Gallery.Reorder(body.OrderedIDs); err != nil {
		if errors.Is(err, domain.ErrValidation) {
			response.Error(w, http.StatusBadRequest, "VALIDATION_FAILED", "Ordered IDs are required")
			return
		}
		response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not reorder gallery")
		return
	}
	items, err := h.Gallery.ListAdmin()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not load gallery")
		return
	}
	response.OK(w, items)
}

func (h *GalleryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	if err := h.Gallery.Delete(chi.URLParam(r, "id")); err != nil {
		switch {
		case errors.Is(err, domain.ErrNotFound):
			response.Error(w, http.StatusNotFound, "NOT_FOUND", "Image not found")
		default:
			response.Error(w, http.StatusInternalServerError, "GALLERY_ERROR", "Could not delete image")
		}
		return
	}
	response.OK(w, map[string]bool{"ok": true})
}
