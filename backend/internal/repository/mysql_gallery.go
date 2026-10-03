package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/jmoiron/sqlx"

	"snswindowtinting/backend/internal/domain"
)

type MySQLGalleryRepository struct {
	db *sqlx.DB
}

func NewMySQLGalleryRepository(db *sqlx.DB) *MySQLGalleryRepository {
	return &MySQLGalleryRepository{db: db}
}

type galleryRow struct {
	ID        string    `db:"id"`
	URL       string    `db:"url"`
	Alt       string    `db:"alt"`
	SortOrder int       `db:"sort_order"`
	IsVisible bool      `db:"is_visible"`
	CreatedAt time.Time `db:"created_at"`
}

func (r *MySQLGalleryRepository) List(visibleOnly bool) ([]domain.GalleryImage, error) {
	query := `
		SELECT id, url, alt, sort_order, is_visible, created_at
		FROM gallery_images`
	if visibleOnly {
		query += ` WHERE is_visible = 1`
	}
	query += ` ORDER BY sort_order ASC, created_at ASC`

	var rows []galleryRow
	if err := r.db.Select(&rows, query); err != nil {
		return nil, err
	}
	out := make([]domain.GalleryImage, 0, len(rows))
	for _, row := range rows {
		out = append(out, *toGallery(row))
	}
	return out, nil
}

func (r *MySQLGalleryRepository) GetByID(id string) (*domain.GalleryImage, error) {
	var row galleryRow
	err := r.db.Get(&row, `
		SELECT id, url, alt, sort_order, is_visible, created_at
		FROM gallery_images WHERE id = ? LIMIT 1`, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	return toGallery(row), nil
}

func (r *MySQLGalleryRepository) Create(image *domain.GalleryImage) error {
	_, err := r.db.Exec(`
		INSERT INTO gallery_images (id, url, alt, sort_order, is_visible)
		VALUES (?, ?, ?, ?, ?)`,
		image.ID,
		image.URL,
		image.Alt,
		image.SortOrder,
		image.IsVisible,
	)
	return err
}

func (r *MySQLGalleryRepository) Update(image *domain.GalleryImage) error {
	res, err := r.db.Exec(`
		UPDATE gallery_images SET alt = ?, sort_order = ?, is_visible = ?
		WHERE id = ?`,
		image.Alt,
		image.SortOrder,
		image.IsVisible,
		image.ID,
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

func (r *MySQLGalleryRepository) Delete(id string) error {
	res, err := r.db.Exec(`DELETE FROM gallery_images WHERE id = ?`, id)
	if err != nil {
		return err
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *MySQLGalleryRepository) NextSortOrder() (int, error) {
	var max sql.NullInt64
	if err := r.db.Get(&max, `SELECT MAX(sort_order) FROM gallery_images`); err != nil {
		return 0, err
	}
	if !max.Valid {
		return 0, nil
	}
	return int(max.Int64) + 1, nil
}

func (r *MySQLGalleryRepository) Reorder(orderedIDs []string) error {
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	for i, id := range orderedIDs {
		if _, err := tx.Exec(`UPDATE gallery_images SET sort_order = ? WHERE id = ?`, i, id); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func toGallery(row galleryRow) *domain.GalleryImage {
	return &domain.GalleryImage{
		ID:        row.ID,
		URL:       row.URL,
		Alt:       row.Alt,
		SortOrder: row.SortOrder,
		IsVisible: row.IsVisible,
		CreatedAt: row.CreatedAt,
	}
}
