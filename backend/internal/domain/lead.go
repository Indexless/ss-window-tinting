package domain

import "time"

type Lead struct {
	ID               string     `json:"id"`
	Name             string     `json:"name"`
	Phone            string     `json:"phone"`
	Email            string     `json:"email"`
	Service          string     `json:"service"`
	PropertyType     string     `json:"propertyType"`
	PreferredContact string     `json:"preferredContact"`
	Message          string     `json:"message"`
	Source           string     `json:"source"`
	Status           string     `json:"status"`
	Notes            string     `json:"notes"`
	PrivacyConsent   bool       `json:"privacyConsent"`
	MarketingConsent bool       `json:"marketingConsent"`
	ConsentedAt      *time.Time `json:"consentedAt,omitempty"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
}

type CreateLeadInput struct {
	Name             string `json:"name"`
	Phone            string `json:"phone"`
	Email            string `json:"email"`
	Service          string `json:"service"`
	PropertyType     string `json:"propertyType"`
	PreferredContact string `json:"preferredContact"`
	Message          string `json:"message"`
	Source           string `json:"source"`
	Notes            string `json:"notes"`
	PrivacyConsent   bool   `json:"privacyConsent"`
	MarketingConsent bool   `json:"marketingConsent"`
}

type UpdateLeadInput struct {
	Name             *string `json:"name"`
	Phone            *string `json:"phone"`
	Email            *string `json:"email"`
	Service          *string `json:"service"`
	PropertyType     *string `json:"propertyType"`
	PreferredContact *string `json:"preferredContact"`
	Message          *string `json:"message"`
	Source           *string `json:"source"`
	Status           *string `json:"status"`
	Notes            *string `json:"notes"`
}

type UpdateUserInput struct {
	Name     *string `json:"name"`
	Email    *string `json:"email"`
	Password *string `json:"password"`
	Role     *string `json:"role"`
	IsActive *bool   `json:"isActive"`
}
