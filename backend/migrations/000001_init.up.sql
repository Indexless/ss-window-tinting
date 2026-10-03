CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(64) NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  expires_at DATETIME(6) NOT NULL,
  revoked_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_config (
  id TINYINT NOT NULL PRIMARY KEY DEFAULT 1,
  business_name VARCHAR(255) NOT NULL DEFAULT 'S&S Window Tinting',
  tagline VARCHAR(255) NOT NULL DEFAULT 'Professional Window Tinting',
  established_year INT NOT NULL DEFAULT 2019,
  whatsapp_number VARCHAR(64) NOT NULL DEFAULT '',
  phone VARCHAR(64) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL DEFAULT '',
  instagram_handle VARCHAR(128) NOT NULL DEFAULT '',
  whatsapp_prefill TEXT NOT NULL,
  seo_title VARCHAR(512) NOT NULL DEFAULT 'S&S Window Tinting | Automotive, Commercial & Residential Window Tinting',
  seo_description VARCHAR(1024) NOT NULL DEFAULT 'Professional window tinting for vehicles, homes and businesses. S&S Window Tinting provides quality automotive, commercial and residential window tinting services.',
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT chk_single_config CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
