package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"

	"snswindowtinting/backend/internal/domain"
)

type MySQLSiteConfigRepository struct {
	db *sqlx.DB
}

func NewMySQLSiteConfigRepository(db *sqlx.DB) *MySQLSiteConfigRepository {
	return &MySQLSiteConfigRepository{db: db}
}

func (r *MySQLSiteConfigRepository) Get() (*domain.SiteConfig, error) {
	var cfg domain.SiteConfig
	err := r.db.Get(&cfg, `
		SELECT business_name, tagline, established_year, whatsapp_number, phone, email,
		       instagram_handle, whatsapp_prefill, seo_title, seo_description, updated_at
		FROM site_config WHERE id = 1 LIMIT 1`)
	if err != nil {
		return nil, err
	}
	return &cfg, nil
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

	_, err = r.db.Exec(`
		UPDATE site_config SET
			business_name = ?, tagline = ?, established_year = ?,
			whatsapp_number = ?, phone = ?, email = ?, instagram_handle = ?,
			whatsapp_prefill = ?, seo_title = ?, seo_description = ?
		WHERE id = 1`,
		current.BusinessName, current.Tagline, current.EstablishedYear,
		current.WhatsappNumber, current.Phone, current.Email, current.InstagramHandle,
		current.WhatsappPrefill, current.SEOTitle, current.SEODescription,
	)
	if err != nil {
		return nil, fmt.Errorf("update site_config: %w", err)
	}
	return r.Get()
}
