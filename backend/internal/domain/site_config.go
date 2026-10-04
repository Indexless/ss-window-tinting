package domain

import "time"

type FooterLink struct {
	Label string `json:"label"`
	Href  string `json:"href"`
}

type FAQItem struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type SocialLink struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
	// Label kept for backward-compatible reads of older saved JSON.
	Label string `json:"label,omitempty"`
}

type PolicyDoc struct {
	Title     string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
	Body      string `json:"body"`
}

// SiteConfig holds editable public business settings served to the frontend.
type SiteConfig struct {
	BusinessName        string       `json:"businessName"`
	Tagline             string       `json:"tagline"`
	EstablishedYear     int          `json:"establishedYear"`
	WhatsappNumber      string       `json:"whatsappNumber"`
	Phone               string       `json:"phone"`
	Email               string       `json:"email"`
	InstagramHandle     string       `json:"instagramHandle"`
	WhatsappPrefill     string       `json:"whatsappPrefill"`
	SEOTitle            string       `json:"seoTitle"`
	SEODescription      string       `json:"seoDescription"`
	FooterCategories    string       `json:"footerCategories"`
	FooterCopyright     string       `json:"footerCopyright"`
	FooterServicesTitle string       `json:"footerServicesTitle"`
	FooterNavigateTitle string       `json:"footerNavigateTitle"`
	FooterConnectTitle  string       `json:"footerConnectTitle"`
	FooterServices      []FooterLink `json:"footerServices"`
	FooterNavigate      []FooterLink `json:"footerNavigate"`
	FooterShowPrivacy   bool         `json:"footerShowPrivacy"`
	FooterShowCookies   bool         `json:"footerShowCookies"`
	FooterShowTerms     bool         `json:"footerShowTerms"`
	FAQ                 []FAQItem    `json:"faq"`
	SocialLinks         []SocialLink `json:"socialLinks"`
	PolicyPrivacy       PolicyDoc    `json:"policyPrivacy"`
	PolicyCookies       PolicyDoc    `json:"policyCookies"`
	PolicyTerms         PolicyDoc    `json:"policyTerms"`
	UpdatedAt           time.Time    `json:"updatedAt"`
}

type SiteConfigUpdate struct {
	BusinessName        *string       `json:"businessName"`
	Tagline             *string       `json:"tagline"`
	EstablishedYear     *int          `json:"establishedYear"`
	WhatsappNumber      *string       `json:"whatsappNumber"`
	Phone               *string       `json:"phone"`
	Email               *string       `json:"email"`
	InstagramHandle     *string       `json:"instagramHandle"`
	WhatsappPrefill     *string       `json:"whatsappPrefill"`
	SEOTitle            *string       `json:"seoTitle"`
	SEODescription      *string       `json:"seoDescription"`
	FooterCategories    *string       `json:"footerCategories"`
	FooterCopyright     *string       `json:"footerCopyright"`
	FooterServicesTitle *string       `json:"footerServicesTitle"`
	FooterNavigateTitle *string       `json:"footerNavigateTitle"`
	FooterConnectTitle  *string       `json:"footerConnectTitle"`
	FooterServices      *[]FooterLink `json:"footerServices"`
	FooterNavigate      *[]FooterLink `json:"footerNavigate"`
	FooterShowPrivacy   *bool         `json:"footerShowPrivacy"`
	FooterShowCookies   *bool         `json:"footerShowCookies"`
	FooterShowTerms     *bool         `json:"footerShowTerms"`
	FAQ                 *[]FAQItem    `json:"faq"`
	SocialLinks         *[]SocialLink `json:"socialLinks"`
	PolicyPrivacy       *PolicyDoc    `json:"policyPrivacy"`
	PolicyCookies       *PolicyDoc    `json:"policyCookies"`
	PolicyTerms         *PolicyDoc    `json:"policyTerms"`
}
