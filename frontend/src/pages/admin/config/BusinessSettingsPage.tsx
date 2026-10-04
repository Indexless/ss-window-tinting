import { useEffect, useState } from 'react'
import { SocialIcon } from '../../../components/brand/SocialIcon'
import { handleFromInstagramUrl, SOCIAL_PLATFORMS } from '../../../lib/socialPlatforms'
import { useSiteConfig } from '../../../providers/SiteConfigProvider'
import {
  ConfigSaveBar,
  emptySocialMap,
  socialLinksPayload,
  socialMapFromConfig,
  useConfigSectionSave,
  type SocialUrlMap,
} from './configShared'

export function BusinessSettingsPage() {
  const { config } = useSiteConfig()
  const { status, error, saving, save } = useConfigSectionSave()
  const [businessName, setBusinessName] = useState('')
  const [tagline, setTagline] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [whatsappPrefill, setWhatsappPrefill] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [socialUrls, setSocialUrls] = useState<SocialUrlMap>(emptySocialMap())

  useEffect(() => {
    if (!config) return
    setBusinessName(config.businessName)
    setTagline(config.tagline)
    setWhatsappNumber(config.whatsappNumber)
    setPhone(config.phone)
    setEmail(config.email)
    setWhatsappPrefill(config.whatsappPrefill)
    setSeoTitle(config.seoTitle)
    setSeoDescription(config.seoDescription)
    setSocialUrls(socialMapFromConfig(config))
  }, [config])

  return (
    <form
      className="ss-form ss-portal-panel"
      onSubmit={(e) =>
        void save(
          e,
          {
            businessName: businessName.trim(),
            tagline: tagline.trim(),
            whatsappNumber: whatsappNumber.trim(),
            phone: phone.trim(),
            email: email.trim(),
            instagramHandle: handleFromInstagramUrl(socialUrls.instagram),
            whatsappPrefill: whatsappPrefill.trim(),
            seoTitle: seoTitle.trim(),
            seoDescription: seoDescription.trim(),
            socialLinks: socialLinksPayload(socialUrls),
          },
          'Business settings saved.',
        )
      }
    >
      <p className="ss-eyebrow">Brand</p>
      <h2 className="ss-display ss-display-md mb-3">Business details</h2>
      <div className="ss-form-grid ss-form-grid-2">
        <div>
          <label className="form-label" htmlFor="cfg-name">
            Business name
          </label>
          <input
            id="cfg-name"
            className="form-control"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-tagline">
            Tagline
          </label>
          <input
            id="cfg-tagline"
            className="form-control"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>
      </div>

      <hr className="ss-rule" />
      <p className="ss-eyebrow">Contact</p>
      <h2 className="ss-display ss-display-md mb-3">Channels</h2>
      <div className="ss-form-grid ss-form-grid-2">
        <div>
          <label className="form-label" htmlFor="cfg-wa">
            WhatsApp number
          </label>
          <input
            id="cfg-wa"
            className="form-control"
            placeholder="e.g. 27821234567"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-phone">
            Phone
          </label>
          <input
            id="cfg-phone"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-email">
            Email
          </label>
          <input
            id="cfg-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="form-label" htmlFor="cfg-prefill">
          WhatsApp prefill message
        </label>
        <textarea
          id="cfg-prefill"
          className="form-control"
          value={whatsappPrefill}
          onChange={(e) => setWhatsappPrefill(e.target.value)}
        />
      </div>

      <hr className="ss-rule" />
      <p className="ss-eyebrow">Social</p>
      <h2 className="ss-display ss-display-md mb-2">Social links</h2>
      <p className="ss-muted-note mb-3">
        Add profile URLs for the icons shown in the footer. Leave a field blank to hide that platform.
      </p>
      <div className="ss-social-editor">
        {SOCIAL_PLATFORMS.map((platform) => (
          <div className="ss-social-editor-row" key={platform.id}>
            <span className="ss-social-editor-icon" title={platform.name} aria-hidden="true">
              <SocialIcon platform={platform.id} size={20} />
            </span>
            <label className="visually-hidden" htmlFor={`social-${platform.id}`}>
              {platform.name} URL
            </label>
            <input
              id={`social-${platform.id}`}
              className="form-control"
              placeholder={`${platform.name} URL`}
              value={socialUrls[platform.id]}
              onChange={(e) =>
                setSocialUrls((prev) => ({ ...prev, [platform.id]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>

      <hr className="ss-rule" />
      <p className="ss-eyebrow">SEO</p>
      <h2 className="ss-display ss-display-md mb-3">Search metadata</h2>
      <div className="ss-form-grid">
        <div>
          <label className="form-label" htmlFor="cfg-seo-title">
            SEO title
          </label>
          <input
            id="cfg-seo-title"
            className="form-control"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="cfg-seo-desc">
            SEO description
          </label>
          <textarea
            id="cfg-seo-desc"
            className="form-control"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </div>
      </div>

      <ConfigSaveBar saving={saving} status={status} error={error} />
    </form>
  )
}
