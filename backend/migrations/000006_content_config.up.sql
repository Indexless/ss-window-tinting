ALTER TABLE site_config
  ADD COLUMN faq_json TEXT NULL AFTER footer_show_terms,
  ADD COLUMN social_links_json TEXT NULL AFTER faq_json,
  ADD COLUMN policy_privacy_json TEXT NULL AFTER social_links_json,
  ADD COLUMN policy_cookies_json TEXT NULL AFTER policy_privacy_json,
  ADD COLUMN policy_terms_json TEXT NULL AFTER policy_cookies_json;
