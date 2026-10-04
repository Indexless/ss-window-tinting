ALTER TABLE site_config
  ADD COLUMN footer_categories VARCHAR(255) NOT NULL DEFAULT 'Automotive / Commercial / Residential' AFTER seo_description,
  ADD COLUMN footer_copyright VARCHAR(512) NOT NULL DEFAULT '' AFTER footer_categories,
  ADD COLUMN footer_services_title VARCHAR(64) NOT NULL DEFAULT 'Services' AFTER footer_copyright,
  ADD COLUMN footer_navigate_title VARCHAR(64) NOT NULL DEFAULT 'Navigate' AFTER footer_services_title,
  ADD COLUMN footer_connect_title VARCHAR(64) NOT NULL DEFAULT 'Connect' AFTER footer_navigate_title,
  ADD COLUMN footer_services_json TEXT NULL AFTER footer_connect_title,
  ADD COLUMN footer_navigate_json TEXT NULL AFTER footer_services_json,
  ADD COLUMN footer_show_privacy TINYINT(1) NOT NULL DEFAULT 1 AFTER footer_navigate_json,
  ADD COLUMN footer_show_cookies TINYINT(1) NOT NULL DEFAULT 1 AFTER footer_show_privacy,
  ADD COLUMN footer_show_terms TINYINT(1) NOT NULL DEFAULT 1 AFTER footer_show_cookies;

UPDATE site_config SET
  footer_services_json = '[{"label":"Automotive","href":"/#services"},{"label":"Commercial","href":"/#services"},{"label":"Residential","href":"/#services"}]',
  footer_navigate_json = '[{"label":"Home","href":"/#home"},{"label":"Services","href":"/#services"},{"label":"Our Work","href":"/#work"},{"label":"About","href":"/#about"},{"label":"FAQ","href":"/#faq"},{"label":"Contact","href":"/#contact"}]'
WHERE id = 1
  AND (footer_services_json IS NULL OR footer_services_json = '' OR footer_navigate_json IS NULL OR footer_navigate_json = '');
