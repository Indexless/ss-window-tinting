package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"snswindowtinting/backend/internal/domain"
)

type MySQLRefreshRepository struct {
	db *sqlx.DB
}

func NewMySQLRefreshRepository(db *sqlx.DB) *MySQLRefreshRepository {
	return &MySQLRefreshRepository{db: db}
}

func (r *MySQLRefreshRepository) Save(token *domain.RefreshToken) error {
	if token.ID == "" {
		token.ID = uuid.NewString()
	}
	_, err := r.db.Exec(`
		INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
		VALUES (?, ?, ?, ?)`,
		token.ID, token.UserID, token.TokenHash, token.ExpiresAt)
	return err
}

func (r *MySQLRefreshRepository) GetByHash(hash string) (*domain.RefreshToken, error) {
	var row struct {
		ID        string       `db:"id"`
		UserID    string       `db:"user_id"`
		TokenHash string       `db:"token_hash"`
		ExpiresAt time.Time    `db:"expires_at"`
		RevokedAt sql.NullTime `db:"revoked_at"`
	}
	err := r.db.Get(&row, `
		SELECT id, user_id, token_hash, expires_at, revoked_at
		FROM refresh_tokens WHERE token_hash = ? LIMIT 1`, hash)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	token := &domain.RefreshToken{
		ID:        row.ID,
		UserID:    row.UserID,
		TokenHash: row.TokenHash,
		ExpiresAt: row.ExpiresAt,
	}
	if row.RevokedAt.Valid {
		t := row.RevokedAt.Time
		token.RevokedAt = &t
	}
	return token, nil
}

func (r *MySQLRefreshRepository) RevokeByHash(hash string) error {
	_, err := r.db.Exec(`UPDATE refresh_tokens SET revoked_at = UTC_TIMESTAMP(6) WHERE token_hash = ? AND revoked_at IS NULL`, hash)
	return err
}

func (r *MySQLRefreshRepository) CountActive() (int, error) {
	var count int
	err := r.db.Get(&count, `
		SELECT COUNT(1) FROM refresh_tokens
		WHERE revoked_at IS NULL AND expires_at > UTC_TIMESTAMP(6)`)
	return count, err
}

func (r *MySQLRefreshRepository) PurgeExpired() (int64, error) {
	res, err := r.db.Exec(`
		DELETE FROM refresh_tokens
		WHERE expires_at <= UTC_TIMESTAMP(6) OR revoked_at IS NOT NULL`)
	if err != nil {
		return 0, err
	}
	return res.RowsAffected()
}
