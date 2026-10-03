package usecase

import (
	"strings"
	"time"

	"github.com/google/uuid"

	"snswindowtinting/backend/internal/domain"
	"snswindowtinting/backend/internal/repository"
)

type LeadsUseCase struct {
	leads repository.LeadRepository
}

func NewLeadsUseCase(leads repository.LeadRepository) *LeadsUseCase {
	return &LeadsUseCase{leads: leads}
}

func (uc *LeadsUseCase) List() ([]domain.Lead, error) {
	return uc.leads.List()
}

func (uc *LeadsUseCase) CreateFromWebsite(input domain.CreateLeadInput) (*domain.Lead, error) {
	if !input.PrivacyConsent {
		return nil, domain.ErrValidation
	}
	input.Source = "website"
	return uc.create(input, "new", true)
}

func (uc *LeadsUseCase) CreateManual(input domain.CreateLeadInput) (*domain.Lead, error) {
	source := strings.ToLower(strings.TrimSpace(input.Source))
	if source == "" {
		source = "whatsapp"
	}
	if source != "whatsapp" && source != "website" && source != "other" {
		return nil, domain.ErrValidation
	}
	input.Source = source
	// Staff-entered leads are processed under the business relationship to quote/serve the client.
	input.PrivacyConsent = true
	return uc.create(input, "new", true)
}

func (uc *LeadsUseCase) create(input domain.CreateLeadInput, status string, recordConsent bool) (*domain.Lead, error) {
	name := strings.TrimSpace(input.Name)
	if name == "" {
		return nil, domain.ErrValidation
	}
	phone := strings.TrimSpace(input.Phone)
	email := strings.TrimSpace(input.Email)
	if phone == "" && email == "" {
		return nil, domain.ErrValidation
	}

	now := time.Now().UTC()
	lead := &domain.Lead{
		ID:               "lead_" + uuid.NewString(),
		Name:             name,
		Phone:            phone,
		Email:            strings.ToLower(email),
		Service:          strings.TrimSpace(input.Service),
		PropertyType:     strings.TrimSpace(input.PropertyType),
		PreferredContact: strings.TrimSpace(input.PreferredContact),
		Message:          strings.TrimSpace(input.Message),
		Source:           strings.TrimSpace(input.Source),
		Status:           status,
		Notes:            strings.TrimSpace(input.Notes),
		PrivacyConsent:   input.PrivacyConsent,
		MarketingConsent: input.MarketingConsent,
		CreatedAt:        now,
		UpdatedAt:        now,
	}
	if recordConsent && input.PrivacyConsent {
		lead.ConsentedAt = &now
	}
	if err := uc.leads.Create(lead); err != nil {
		return nil, err
	}
	return lead, nil
}

func (uc *LeadsUseCase) Update(id string, input domain.UpdateLeadInput) (*domain.Lead, error) {
	lead, err := uc.leads.GetByID(id)
	if err != nil {
		return nil, err
	}

	if input.Name != nil {
		name := strings.TrimSpace(*input.Name)
		if name == "" {
			return nil, domain.ErrValidation
		}
		lead.Name = name
	}
	if input.Phone != nil {
		lead.Phone = strings.TrimSpace(*input.Phone)
	}
	if input.Email != nil {
		lead.Email = strings.ToLower(strings.TrimSpace(*input.Email))
	}
	if input.Service != nil {
		lead.Service = strings.TrimSpace(*input.Service)
	}
	if input.PropertyType != nil {
		lead.PropertyType = strings.TrimSpace(*input.PropertyType)
	}
	if input.PreferredContact != nil {
		lead.PreferredContact = strings.TrimSpace(*input.PreferredContact)
	}
	if input.Message != nil {
		lead.Message = strings.TrimSpace(*input.Message)
	}
	if input.Notes != nil {
		lead.Notes = strings.TrimSpace(*input.Notes)
	}
	if input.Source != nil {
		source := strings.ToLower(strings.TrimSpace(*input.Source))
		if source != "whatsapp" && source != "website" && source != "other" {
			return nil, domain.ErrValidation
		}
		lead.Source = source
	}
	if input.Status != nil {
		status := strings.ToLower(strings.TrimSpace(*input.Status))
		switch status {
		case "new", "contacted", "quoted", "won", "lost":
			lead.Status = status
		default:
			return nil, domain.ErrValidation
		}
	}
	if lead.Phone == "" && lead.Email == "" {
		return nil, domain.ErrValidation
	}

	if err := uc.leads.Update(lead); err != nil {
		return nil, err
	}
	return uc.leads.GetByID(id)
}
