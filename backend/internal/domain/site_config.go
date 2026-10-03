package domain

import "time"

// SiteConfig holds editable public business settings served to the frontend.
type SiteConfig struct {
	BusinessName      string    `json:"businessName" db:"business_name"`
	Tagline           string    `json:"tagline" db:"tagline"`
	EstablishedYear   int       `json:"establishedYear" db:"established_year"`
	WhatsappNumber    string    `json:"whatsappNumber" db:"whatsapp_number"`
	Phone             string    `json:"phone" db:"phone"`
	Email             string    `json:"email" db:"email"`
	InstagramHandle   string    `json:"instagramHandle" db:"instagram_handle"`
	WhatsappPrefill   string    `json:"whatsappPrefill" db:"whatsapp_prefill"`
	SEOTitle          string    `json:"seoTitle" db:"seo_title"`
	SEODescription    string    `json:"seoDescription" db:"seo_description"`
	UpdatedAt         time.Time `json:"updatedAt" db:"updated_at"`
}

type SiteConfigUpdate struct {
	BusinessName    *string `json:"businessName"`
	Tagline         *string `json:"tagline"`
	EstablishedYear *int    `json:"establishedYear"`
	WhatsappNumber  *string `json:"whatsappNumber"`
	Phone           *string `json:"phone"`
	Email           *string `json:"email"`
	InstagramHandle *string `json:"instagramHandle"`
	WhatsappPrefill *string `json:"whatsappPrefill"`
	SEOTitle        *string `json:"seoTitle"`
	SEODescription  *string `json:"seoDescription"`
}
