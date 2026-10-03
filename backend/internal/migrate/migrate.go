package migrate

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

func Up(db *sqlx.DB, dir string) error {
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			filename VARCHAR(255) NOT NULL PRIMARY KEY,
			applied_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
		)`); err != nil {
		return fmt.Errorf("schema_migrations: %w", err)
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		return err
	}

	var files []string
	for _, entry := range entries {
		name := entry.Name()
		if !entry.IsDir() && strings.HasSuffix(name, ".up.sql") {
			files = append(files, name)
		}
	}
	sort.Strings(files)

	for _, name := range files {
		var exists int
		if err := db.Get(&exists, `SELECT COUNT(1) FROM schema_migrations WHERE filename = ?`, name); err != nil {
			return err
		}
		if exists > 0 {
			continue
		}

		sqlBytes, err := os.ReadFile(filepath.Join(dir, name))
		if err != nil {
			return err
		}
		if _, err := db.Exec(string(sqlBytes)); err != nil {
			return fmt.Errorf("migrate %s: %w", name, err)
		}
		if _, err := db.Exec(`INSERT INTO schema_migrations (filename) VALUES (?)`, name); err != nil {
			return err
		}
	}

	return seed(db)
}

func seed(db *sqlx.DB) error {
	var userCount int
	if err := db.Get(&userCount, `SELECT COUNT(1) FROM users`); err != nil {
		return err
	}
	if userCount == 0 {
		hash, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		_, err = db.Exec(`
			INSERT INTO users (id, email, password_hash, name, role, is_active)
			VALUES (?, ?, ?, ?, ?, 1)`,
			"usr_admin_001",
			"admin@sswindowtinting.com",
			string(hash),
			"S&S Admin",
			"admin",
		)
		if err != nil {
			return fmt.Errorf("seed user: %w", err)
		}
	}

	var configCount int
	if err := db.Get(&configCount, `SELECT COUNT(1) FROM site_config`); err != nil {
		return err
	}
	if configCount == 0 {
		_, err := db.Exec(`
			INSERT INTO site_config (
				id, business_name, tagline, established_year,
				whatsapp_number, phone, email, instagram_handle, whatsapp_prefill,
				seo_title, seo_description
			) VALUES (
				1, 'S&S Window Tinting', 'Professional Window Tinting', 2019,
				'', '', '', '',
				'Hi S&S Window Tinting - I would like a quote for window tinting.',
				'S&S Window Tinting | Automotive, Commercial & Residential Window Tinting',
				'Professional window tinting for vehicles, homes and businesses. S&S Window Tinting provides quality automotive, commercial and residential window tinting services.'
			)`)
		if err != nil {
			return fmt.Errorf("seed site_config: %w", err)
		}
	}

	return nil
}
