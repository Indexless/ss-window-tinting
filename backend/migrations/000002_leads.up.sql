CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL DEFAULT '',
  service VARCHAR(128) NOT NULL DEFAULT '',
  property_type VARCHAR(255) NOT NULL DEFAULT '',
  preferred_contact VARCHAR(64) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT 'website',
  status VARCHAR(32) NOT NULL DEFAULT 'new',
  notes TEXT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  INDEX idx_leads_status (status),
  INDEX idx_leads_source (source),
  INDEX idx_leads_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
