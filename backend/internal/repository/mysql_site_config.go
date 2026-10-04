package repository

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"

	"snswindowtinting/backend/internal/domain"
)

type MySQLSiteConfigRepository struct {
	db *sqlx.DB
}

func NewMySQLSiteConfigRepository(db *sqlx.DB) *MySQLSiteConfigRepository {
	return &MySQLSiteConfigRepository{db: db}
}

type siteConfigRow struct {
	BusinessName        string    `db:"business_name"`
	Tagline             string    `db:"tagline"`
	EstablishedYear     int       `db:"established_year"`
	WhatsappNumber      string    `db:"whatsapp_number"`
	Phone               string    `db:"phone"`
	Email               string    `db:"email"`
	InstagramHandle     string    `db:"instagram_handle"`
	WhatsappPrefill     string    `db:"whatsapp_prefill"`
	SEOTitle            string    `db:"seo_title"`
	SEODescription      string    `db:"seo_description"`
	FooterCategories    string    `db:"footer_categories"`
	FooterCopyright     string    `db:"footer_copyright"`
	FooterServicesTitle string    `db:"footer_services_title"`
	FooterNavigateTitle string    `db:"footer_navigate_title"`
	FooterConnectTitle  string    `db:"footer_connect_title"`
	FooterServicesJSON  string    `db:"footer_services_json"`
	FooterNavigateJSON  string    `db:"footer_navigate_json"`
	FooterShowPrivacy   bool      `db:"footer_show_privacy"`
	FooterShowCookies   bool      `db:"footer_show_cookies"`
	FooterShowTerms     bool      `db:"footer_show_terms"`
	FAQJSON             *string   `db:"faq_json"`
	SocialLinksJSON     *string   `db:"social_links_json"`
	PolicyPrivacyJSON   *string   `db:"policy_privacy_json"`
	PolicyCookiesJSON   *string   `db:"policy_cookies_json"`
	PolicyTermsJSON     *string   `db:"policy_terms_json"`
	UpdatedAt           time.Time `db:"updated_at"`
}

func defaultFooterServices() []domain.FooterLink {
	return []domain.FooterLink{
		{Label: "Automotive", Href: "/#services"},
		{Label: "Commercial", Href: "/#services"},
		{Label: "Residential", Href: "/#services"},
	}
}

func defaultFooterNavigate() []domain.FooterLink {
	return []domain.FooterLink{
		{Label: "Home", Href: "/#home"},
		{Label: "Services", Href: "/#services"},
		{Label: "Our Work", Href: "/#work"},
		{Label: "About", Href: "/#about"},
		{Label: "FAQ", Href: "/#faq"},
		{Label: "Contact", Href: "/#contact"},
	}
}

func parseFooterLinks(raw string, fallback []domain.FooterLink) []domain.FooterLink {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fallback
	}
	var links []domain.FooterLink
	if err := json.Unmarshal([]byte(raw), &links); err != nil {
		return fallback
	}
	return parseFooterLinksMust(links, fallback)
}

func parseFooterLinksMust(links []domain.FooterLink, fallback []domain.FooterLink) []domain.FooterLink {
	cleaned := make([]domain.FooterLink, 0, len(links))
	for _, link := range links {
		label := strings.TrimSpace(link.Label)
		href := strings.TrimSpace(link.Href)
		if label == "" || href == "" {
			continue
		}
		cleaned = append(cleaned, domain.FooterLink{Label: label, Href: href})
	}
	if len(cleaned) == 0 {
		return fallback
	}
	return cleaned
}

func encodeJSON(v any) (string, error) {
	b, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func deref(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func parseFAQ(raw string) []domain.FAQItem {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return defaultFAQ()
	}
	var items []domain.FAQItem
	if err := json.Unmarshal([]byte(raw), &items); err != nil {
		return defaultFAQ()
	}
	cleaned := make([]domain.FAQItem, 0, len(items))
	for _, item := range items {
		q := strings.TrimSpace(item.Question)
		a := strings.TrimSpace(item.Answer)
		if q == "" || a == "" {
			continue
		}
		cleaned = append(cleaned, domain.FAQItem{Question: q, Answer: a})
	}
	if len(cleaned) == 0 {
		return defaultFAQ()
	}
	return cleaned
}

func normalizeSocialPlatform(value string) string {
	key := strings.ToLower(strings.TrimSpace(value))
	switch key {
	case "instagram", "facebook", "tiktok", "youtube", "x", "linkedin":
		return key
	case "twitter":
		return "x"
	case "ig":
		return "instagram"
	case "fb":
		return "facebook"
	case "yt":
		return "youtube"
	default:
		return ""
	}
}

func parseSocialLinks(raw string) []domain.SocialLink {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return []domain.SocialLink{}
	}
	var items []domain.SocialLink
	if err := json.Unmarshal([]byte(raw), &items); err != nil {
		return []domain.SocialLink{}
	}
	return cleanSocialLinks(items)
}

func parsePolicy(raw string, fallback domain.PolicyDoc) domain.PolicyDoc {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fallback
	}
	var doc domain.PolicyDoc
	if err := json.Unmarshal([]byte(raw), &doc); err != nil {
		return fallback
	}
	doc.Title = strings.TrimSpace(doc.Title)
	doc.UpdatedAt = strings.TrimSpace(doc.UpdatedAt)
	doc.Body = strings.TrimSpace(doc.Body)
	if doc.Title == "" {
		doc.Title = fallback.Title
	}
	if doc.Body == "" {
		return fallback
	}
	return doc
}

func cleanFAQ(items []domain.FAQItem) []domain.FAQItem {
	return parseFAQMust(items)
}

func parseFAQMust(items []domain.FAQItem) []domain.FAQItem {
	cleaned := make([]domain.FAQItem, 0, len(items))
	for _, item := range items {
		q := strings.TrimSpace(item.Question)
		a := strings.TrimSpace(item.Answer)
		if q == "" || a == "" {
			continue
		}
		cleaned = append(cleaned, domain.FAQItem{Question: q, Answer: a})
	}
	if len(cleaned) == 0 {
		return defaultFAQ()
	}
	return cleaned
}

func cleanSocialLinks(items []domain.SocialLink) []domain.SocialLink {
	cleaned := make([]domain.SocialLink, 0, len(items))
	seen := map[string]bool{}
	for _, item := range items {
		platform := normalizeSocialPlatform(item.Platform)
		if platform == "" {
			platform = normalizeSocialPlatform(item.Label)
		}
		url := strings.TrimSpace(item.URL)
		if platform == "" || url == "" || seen[platform] {
			continue
		}
		seen[platform] = true
		cleaned = append(cleaned, domain.SocialLink{Platform: platform, URL: url})
	}
	return cleaned
}

func cleanPolicy(doc domain.PolicyDoc, fallback domain.PolicyDoc) domain.PolicyDoc {
	doc.Title = strings.TrimSpace(doc.Title)
	doc.UpdatedAt = strings.TrimSpace(doc.UpdatedAt)
	doc.Body = strings.TrimSpace(doc.Body)
	if doc.Title == "" {
		doc.Title = fallback.Title
	}
	if doc.Body == "" {
		return fallback
	}
	return doc
}

func withInstagramFromHandle(social []domain.SocialLink, handle string) []domain.SocialLink {
	handle = strings.TrimSpace(strings.TrimPrefix(handle, "@"))
	if handle == "" {
		return social
	}
	for _, item := range social {
		if item.Platform == "instagram" {
			return social
		}
	}
	out := make([]domain.SocialLink, 0, len(social)+1)
	out = append(out, domain.SocialLink{
		Platform: "instagram",
		URL:      "https://instagram.com/" + handle,
	})
	out = append(out, social...)
	return out
}

func instagramHandleFromSocial(social []domain.SocialLink) string {
	for _, item := range social {
		if item.Platform != "instagram" {
			continue
		}
		url := strings.TrimSpace(item.URL)
		url = strings.TrimPrefix(url, "https://")
		url = strings.TrimPrefix(url, "http://")
		url = strings.TrimPrefix(url, "www.")
		url = strings.TrimPrefix(url, "instagram.com/")
		url = strings.Trim(url, "/")
		parts := strings.Split(url, "/")
		if len(parts) > 0 {
			return strings.TrimPrefix(parts[0], "@")
		}
	}
	return ""
}

func toSiteConfig(row siteConfigRow) *domain.SiteConfig {
	social := withInstagramFromHandle(parseSocialLinks(deref(row.SocialLinksJSON)), row.InstagramHandle)
	handle := row.InstagramHandle
	if derived := instagramHandleFromSocial(social); derived != "" {
		handle = derived
	}
	return &domain.SiteConfig{
		BusinessName:        row.BusinessName,
		Tagline:             row.Tagline,
		EstablishedYear:     row.EstablishedYear,
		WhatsappNumber:      row.WhatsappNumber,
		Phone:               row.Phone,
		Email:               row.Email,
		InstagramHandle:     handle,
		WhatsappPrefill:     row.WhatsappPrefill,
		SEOTitle:            row.SEOTitle,
		SEODescription:      row.SEODescription,
		FooterCategories:    row.FooterCategories,
		FooterCopyright:     row.FooterCopyright,
		FooterServicesTitle: row.FooterServicesTitle,
		FooterNavigateTitle: row.FooterNavigateTitle,
		FooterConnectTitle:  row.FooterConnectTitle,
		FooterServices:      parseFooterLinks(row.FooterServicesJSON, defaultFooterServices()),
		FooterNavigate:      parseFooterLinks(row.FooterNavigateJSON, defaultFooterNavigate()),
		FooterShowPrivacy:   row.FooterShowPrivacy,
		FooterShowCookies:   row.FooterShowCookies,
		FooterShowTerms:     row.FooterShowTerms,
		FAQ:                 parseFAQ(deref(row.FAQJSON)),
		SocialLinks:         social,
		PolicyPrivacy:       parsePolicy(deref(row.PolicyPrivacyJSON), defaultPolicyPrivacy()),
		PolicyCookies:       parsePolicy(deref(row.PolicyCookiesJSON), defaultPolicyCookies()),
		PolicyTerms:         parsePolicy(deref(row.PolicyTermsJSON), defaultPolicyTerms()),
		UpdatedAt:           row.UpdatedAt,
	}
}

func (r *MySQLSiteConfigRepository) Get() (*domain.SiteConfig, error) {
	var row siteConfigRow
	err := r.db.Get(&row, `
		SELECT business_name, tagline, established_year, whatsapp_number, phone, email,
		       instagram_handle, whatsapp_prefill, seo_title, seo_description,
		       footer_categories, footer_copyright, footer_services_title, footer_navigate_title,
		       footer_connect_title, footer_services_json, footer_navigate_json,
		       footer_show_privacy, footer_show_cookies, footer_show_terms,
		       faq_json, social_links_json, policy_privacy_json, policy_cookies_json, policy_terms_json,
		       updated_at
		FROM site_config WHERE id = 1 LIMIT 1`)
	if err != nil {
		return nil, err
	}
	return toSiteConfig(row), nil
}

func (r *MySQLSiteConfigRepository) Update(update domain.SiteConfigUpdate) (*domain.SiteConfig, error) {
	current, err := r.Get()
	if err != nil {
		return nil, err
	}

	if update.BusinessName != nil {
		current.BusinessName = *update.BusinessName
	}
	if update.Tagline != nil {
		current.Tagline = *update.Tagline
	}
	if update.EstablishedYear != nil {
		current.EstablishedYear = *update.EstablishedYear
	}
	if update.WhatsappNumber != nil {
		current.WhatsappNumber = *update.WhatsappNumber
	}
	if update.Phone != nil {
		current.Phone = *update.Phone
	}
	if update.Email != nil {
		current.Email = *update.Email
	}
	if update.InstagramHandle != nil {
		current.InstagramHandle = *update.InstagramHandle
	}
	if update.WhatsappPrefill != nil {
		current.WhatsappPrefill = *update.WhatsappPrefill
	}
	if update.SEOTitle != nil {
		current.SEOTitle = *update.SEOTitle
	}
	if update.SEODescription != nil {
		current.SEODescription = *update.SEODescription
	}
	if update.FooterCategories != nil {
		current.FooterCategories = *update.FooterCategories
	}
	if update.FooterCopyright != nil {
		current.FooterCopyright = *update.FooterCopyright
	}
	if update.FooterServicesTitle != nil {
		current.FooterServicesTitle = *update.FooterServicesTitle
	}
	if update.FooterNavigateTitle != nil {
		current.FooterNavigateTitle = *update.FooterNavigateTitle
	}
	if update.FooterConnectTitle != nil {
		current.FooterConnectTitle = *update.FooterConnectTitle
	}
	if update.FooterServices != nil {
		current.FooterServices = parseFooterLinksMust(*update.FooterServices, defaultFooterServices())
	}
	if update.FooterNavigate != nil {
		current.FooterNavigate = parseFooterLinksMust(*update.FooterNavigate, defaultFooterNavigate())
	}
	if update.FooterShowPrivacy != nil {
		current.FooterShowPrivacy = *update.FooterShowPrivacy
	}
	if update.FooterShowCookies != nil {
		current.FooterShowCookies = *update.FooterShowCookies
	}
	if update.FooterShowTerms != nil {
		current.FooterShowTerms = *update.FooterShowTerms
	}
	if update.FAQ != nil {
		current.FAQ = cleanFAQ(*update.FAQ)
	}
	if update.SocialLinks != nil {
		current.SocialLinks = cleanSocialLinks(*update.SocialLinks)
		if handle := instagramHandleFromSocial(current.SocialLinks); handle != "" {
			current.InstagramHandle = handle
		} else if update.InstagramHandle == nil {
			current.InstagramHandle = ""
		}
	}
	if update.PolicyPrivacy != nil {
		current.PolicyPrivacy = cleanPolicy(*update.PolicyPrivacy, defaultPolicyPrivacy())
	}
	if update.PolicyCookies != nil {
		current.PolicyCookies = cleanPolicy(*update.PolicyCookies, defaultPolicyCookies())
	}
	if update.PolicyTerms != nil {
		current.PolicyTerms = cleanPolicy(*update.PolicyTerms, defaultPolicyTerms())
	}

	servicesJSON, err := encodeJSON(current.FooterServices)
	if err != nil {
		return nil, err
	}
	navigateJSON, err := encodeJSON(current.FooterNavigate)
	if err != nil {
		return nil, err
	}
	faqJSON, err := encodeJSON(current.FAQ)
	if err != nil {
		return nil, err
	}
	socialJSON, err := encodeJSON(current.SocialLinks)
	if err != nil {
		return nil, err
	}
	privacyJSON, err := encodeJSON(current.PolicyPrivacy)
	if err != nil {
		return nil, err
	}
	cookiesJSON, err := encodeJSON(current.PolicyCookies)
	if err != nil {
		return nil, err
	}
	termsJSON, err := encodeJSON(current.PolicyTerms)
	if err != nil {
		return nil, err
	}

	_, err = r.db.Exec(`
		UPDATE site_config SET
			business_name = ?, tagline = ?, established_year = ?,
			whatsapp_number = ?, phone = ?, email = ?, instagram_handle = ?,
			whatsapp_prefill = ?, seo_title = ?, seo_description = ?,
			footer_categories = ?, footer_copyright = ?, footer_services_title = ?,
			footer_navigate_title = ?, footer_connect_title = ?,
			footer_services_json = ?, footer_navigate_json = ?,
			footer_show_privacy = ?, footer_show_cookies = ?, footer_show_terms = ?,
			faq_json = ?, social_links_json = ?,
			policy_privacy_json = ?, policy_cookies_json = ?, policy_terms_json = ?
		WHERE id = 1`,
		current.BusinessName, current.Tagline, current.EstablishedYear,
		current.WhatsappNumber, current.Phone, current.Email, current.InstagramHandle,
		current.WhatsappPrefill, current.SEOTitle, current.SEODescription,
		current.FooterCategories, current.FooterCopyright, current.FooterServicesTitle,
		current.FooterNavigateTitle, current.FooterConnectTitle,
		servicesJSON, navigateJSON,
		current.FooterShowPrivacy, current.FooterShowCookies, current.FooterShowTerms,
		faqJSON, socialJSON, privacyJSON, cookiesJSON, termsJSON,
	)
	if err != nil {
		return nil, fmt.Errorf("update site_config: %w", err)
	}
	return r.Get()
}
