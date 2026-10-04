ALTER TABLE site_config
  DROP COLUMN policy_terms_json,
  DROP COLUMN policy_cookies_json,
  DROP COLUMN policy_privacy_json,
  DROP COLUMN social_links_json,
  DROP COLUMN faq_json;
