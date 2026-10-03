package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/jmoiron/sqlx"

	"snswindowtinting/backend/internal/domain"
)

type MySQLLeadRepository struct {
	db *sqlx.DB
}

func NewMySQLLeadRepository(db *sqlx.DB) *MySQLLeadRepository {
	return &MySQLLeadRepository{db: db}
}

type leadRow struct {
	ID               string         `db:"id"`
	Name             string         `db:"name"`
	Phone            string         `db:"phone"`
	Email            string         `db:"email"`
	Service          string         `db:"service"`
	PropertyType     string         `db:"property_type"`
	PreferredContact string         `db:"preferred_contact"`
	Message          string         `db:"message"`
	Source           string         `db:"source"`
	Status           string         `db:"status"`
	Notes            string         `db:"notes"`
	PrivacyConsent   bool           `db:"privacy_consent"`
	MarketingConsent bool           `db:"marketing_consent"`
	ConsentedAt      sql.NullTime   `db:"consented_at"`
	CreatedAt        time.Time      `db:"created_at"`
	UpdatedAt        time.Time      `db:"updated_at"`
}

func (r *MySQLLeadRepository) List() ([]domain.Lead, error) {
	var rows []leadRow
	if err := r.db.Select(&rows, `
		SELECT id, name, phone, email, service, property_type, preferred_contact,
		       message, source, status, notes, privacy_consent, marketing_consent,
		       consented_at, created_at, updated_at
		FROM leads
		ORDER BY created_at DESC`); err != nil {
		return nil, err
	}
	out := make([]domain.Lead, 0, len(rows))
	for _, row := range rows {
		out = append(out, *toLead(row))
	}
	return out, nil
}

func (r *MySQLLeadRepository) GetByID(id string) (*domain.Lead, error) {
	var row leadRow
	err := r.db.Get(&row, `
		SELECT id, name, phone, email, service, property_type, preferred_contact,
		       message, source, status, notes, privacy_consent, marketing_consent,
		       consented_at, created_at, updated_at
		FROM leads WHERE id = ? LIMIT 1`, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return toLead(row), nil
}

func (r *MySQLLeadRepository) Create(lead *domain.Lead) error {
	var consentedAt any
	if lead.ConsentedAt != nil {
		consentedAt = *lead.ConsentedAt
	}
	_, err := r.db.Exec(`
		INSERT INTO leads (
			id, name, phone, email, service, property_type, preferred_contact,
			message, source, status, notes, privacy_consent, marketing_consent, consented_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		lead.ID,
		lead.Name,
		lead.Phone,
		lead.Email,
		lead.Service,
		lead.PropertyType,
		lead.PreferredContact,
		lead.Message,
		lead.Source,
		lead.Status,
		lead.Notes,
		lead.PrivacyConsent,
		lead.MarketingConsent,
		consentedAt,
	)
	return err
}

func (r *MySQLLeadRepository) Update(lead *domain.Lead) error {
	res, err := r.db.Exec(`
		UPDATE leads SET
			name = ?, phone = ?, email = ?, service = ?, property_type = ?,
			preferred_contact = ?, message = ?, source = ?, status = ?, notes = ?
		WHERE id = ?`,
		lead.Name,
		lead.Phone,
		lead.Email,
		lead.Service,
		lead.PropertyType,
		lead.PreferredContact,
		lead.Message,
		lead.Source,
		lead.Status,
		lead.Notes,
		lead.ID,
	)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func toLead(row leadRow) *domain.Lead {
	lead := &domain.Lead{
		ID:               row.ID,
		Name:             row.Name,
		Phone:            row.Phone,
		Email:            row.Email,
		Service:          row.Service,
		PropertyType:     row.PropertyType,
		PreferredContact: row.PreferredContact,
		Message:          row.Message,
		Source:           row.Source,
		Status:           row.Status,
		Notes:            row.Notes,
		PrivacyConsent:   row.PrivacyConsent,
		MarketingConsent: row.MarketingConsent,
		CreatedAt:        row.CreatedAt,
		UpdatedAt:        row.UpdatedAt,
	}
	if row.ConsentedAt.Valid {
		t := row.ConsentedAt.Time
		lead.ConsentedAt = &t
	}
	return lead
}
