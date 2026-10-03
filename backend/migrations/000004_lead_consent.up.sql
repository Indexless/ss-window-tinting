ALTER TABLE leads
  ADD COLUMN privacy_consent TINYINT(1) NOT NULL DEFAULT 0 AFTER notes,
  ADD COLUMN marketing_consent TINYINT(1) NOT NULL DEFAULT 0 AFTER privacy_consent,
  ADD COLUMN consented_at DATETIME(6) NULL AFTER marketing_consent;
