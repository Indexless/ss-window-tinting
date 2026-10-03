package repository

import (
	"database/sql"
	"errors"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"

	"snswindowtinting/backend/internal/domain"
)

type MySQLUserRepository struct {
	db *sqlx.DB
}

func NewMySQLUserRepository(db *sqlx.DB) *MySQLUserRepository {
	return &MySQLUserRepository{db: db}
}

type userRow struct {
	ID           string    `db:"id"`
	Email        string    `db:"email"`
	PasswordHash string    `db:"password_hash"`
	Name         string    `db:"name"`
	Role         string    `db:"role"`
	IsActive     bool      `db:"is_active"`
	CreatedAt    time.Time `db:"created_at"`
}

func (r *MySQLUserRepository) GetByEmail(email string) (*domain.User, error) {
	var row userRow
	err := r.db.Get(&row, `
		SELECT id, email, password_hash, name, role, is_active, created_at
		FROM users WHERE email = ? LIMIT 1`, strings.ToLower(strings.TrimSpace(email)))
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return toUser(row), nil
}

func (r *MySQLUserRepository) GetByID(id string) (*domain.User, error) {
	var row userRow
	err := r.db.Get(&row, `
		SELECT id, email, password_hash, name, role, is_active, created_at
		FROM users WHERE id = ? LIMIT 1`, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return toUser(row), nil
}

func (r *MySQLUserRepository) List() ([]domain.User, error) {
	var rows []userRow
	if err := r.db.Select(&rows, `
		SELECT id, email, password_hash, name, role, is_active, created_at
		FROM users ORDER BY created_at ASC`); err != nil {
		return nil, err
	}
	users := make([]domain.User, 0, len(rows))
	for _, row := range rows {
		users = append(users, *toUser(row))
	}
	return users, nil
}

func (r *MySQLUserRepository) Create(user *domain.User) error {
	_, err := r.db.Exec(`
		INSERT INTO users (id, email, password_hash, name, role, is_active)
		VALUES (?, ?, ?, ?, ?, ?)`,
		user.ID,
		strings.ToLower(strings.TrimSpace(user.Email)),
		user.PasswordHash,
		user.Name,
		user.Role,
		user.IsActive,
	)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") {
			return domain.ErrConflict
		}
		return err
	}
	return nil
}

func (r *MySQLUserRepository) Update(user *domain.User) error {
	res, err := r.db.Exec(`
		UPDATE users SET email = ?, password_hash = ?, name = ?, role = ?, is_active = ?
		WHERE id = ?`,
		strings.ToLower(strings.TrimSpace(user.Email)),
		user.PasswordHash,
		user.Name,
		user.Role,
		user.IsActive,
		user.ID,
	)
	if err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") {
			return domain.ErrConflict
		}
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *MySQLUserRepository) SetActive(id string, active bool) error {
	res, err := r.db.Exec(`UPDATE users SET is_active = ? WHERE id = ?`, active, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *MySQLUserRepository) Count() (total int, active int, err error) {
	if err = r.db.Get(&total, `SELECT COUNT(1) FROM users`); err != nil {
		return 0, 0, err
	}
	if err = r.db.Get(&active, `SELECT COUNT(1) FROM users WHERE is_active = 1`); err != nil {
		return 0, 0, err
	}
	return total, active, nil
}

func toUser(row userRow) *domain.User {
	return &domain.User{
		ID:           row.ID,
		Email:        row.Email,
		PasswordHash: row.PasswordHash,
		Name:         row.Name,
		Role:         row.Role,
		IsActive:     row.IsActive,
		CreatedAt:    row.CreatedAt,
	}
}
