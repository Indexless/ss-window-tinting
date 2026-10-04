import { useEffect, useState } from 'react'
import { useSiteConfig } from '../../../providers/SiteConfigProvider'
import { ConfigSaveBar, useConfigSectionSave } from './configShared'

export function FooterSettingsPage() {
  const { config } = useSiteConfig()
  const { status, error, saving, save } = useConfigSectionSave()
  const [footerCategories, setFooterCategories] = useState('')
  const [footerCopyright, setFooterCopyright] = useState('')
  const [footerServicesTitle, setFooterServicesTitle] = useState('Services')
  const [footerNavigateTitle, setFooterNavigateTitle] = useState('Navigate')
  const [footerConnectTitle, setFooterConnectTitle] = useState('Connect')
  const [footerShowPrivacy, setFooterShowPrivacy] = useState(true)
  const [footerShowCookies, setFooterShowCookies] = useState(true)
  const [footerShowTerms, setFooterShowTerms] = useState(true)

  useEffect(() => {
    if (!config) return
    setFooterCategories(config.footerCategories ?? '')
    setFooterCopyright(config.footerCopyright ?? '')
    setFooterServicesTitle(config.footerServicesTitle || 'Services')
    setFooterNavigateTitle(config.footerNavigateTitle || 'Navigate')
    setFooterConnectTitle(config.footerConnectTitle || 'Connect')
    setFooterShowPrivacy(config.footerShowPrivacy ?? true)
    setFooterShowCookies(config.footerShowCookies ?? true)
    setFooterShowTerms(config.footerShowTerms ?? true)
  }, [config])

  return (
    <form
      className="ss-form ss-portal-panel"
      onSubmit={(e) =>
        void save(
          e,
          {
            footerCategories: footerCategories.trim(),
            footerCopyright: footerCopyright.trim(),
            footerServicesTitle: footerServicesTitle.trim() || 'Services',
            footerNavigateTitle: footerNavigateTitle.trim() || 'Navigate',
            footerConnectTitle: footerConnectTitle.trim() || 'Connect',
            footerShowPrivacy,
            footerShowCookies,
            footerShowTerms,
          },
          'Footer settings saved.',
        )
      }
    >
      <p className="ss-eyebrow">Footer</p>
      <h2 className="ss-display ss-display-md mb-3">Footer content</h2>
      <p className="ss-muted-note mb-3">
        Services and Navigate destinations stay fixed to the site sections. Edit titles and legal
        toggles here.
      </p>

      <div className="ss-form-grid ss-form-grid-2">
        <div>
          <label className="form-label" htmlFor="cfg-footer-cats">
            Categories line
          </label>
          <input
            id="cfg-footer-cats"
            className="form-control"
            placeholder="Automotive / Commercial / Residential"
            value={footerCategories}
            onChange={(e) => setFooterCategories(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-footer-copy">
            Copyright line
          </label>
          <input
            id="cfg-footer-copy"
            className="form-control"
            placeholder="Leave blank to auto-generate"
            value={footerCopyright}
            onChange={(e) => setFooterCopyright(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-footer-services-title">
            Services column title
          </label>
          <input
            id="cfg-footer-services-title"
            className="form-control"
            value={footerServicesTitle}
            onChange={(e) => setFooterServicesTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-footer-navigate-title">
            Navigate column title
          </label>
          <input
            id="cfg-footer-navigate-title"
            className="form-control"
            value={footerNavigateTitle}
            onChange={(e) => setFooterNavigateTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-footer-connect-title">
            Connect column title
          </label>
          <input
            id="cfg-footer-connect-title"
            className="form-control"
            value={footerConnectTitle}
            onChange={(e) => setFooterConnectTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="ss-consent-stack mt-4">
        <label className="ss-check">
          <input
            type="checkbox"
            checked={footerShowPrivacy}
            onChange={(e) => setFooterShowPrivacy(e.target.checked)}
          />
          <span>Show Privacy link</span>
        </label>
        <label className="ss-check">
          <input
            type="checkbox"
            checked={footerShowCookies}
            onChange={(e) => setFooterShowCookies(e.target.checked)}
          />
          <span>Show Cookies link</span>
        </label>
        <label className="ss-check">
          <input
            type="checkbox"
            checked={footerShowTerms}
            onChange={(e) => setFooterShowTerms(e.target.checked)}
          />
          <span>Show Terms link</span>
        </label>
      </div>

      <ConfigSaveBar saving={saving} status={status} error={error} label="Save footer" />
    </form>
  )
}
