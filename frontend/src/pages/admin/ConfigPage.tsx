import { useEffect, useState, type FormEvent } from 'react'
import { updateSiteConfig } from '../../api/config'
import { useSiteConfig } from '../../providers/SiteConfigProvider'

export function ConfigPage() {
  const { config, refresh } = useSiteConfig()
  const [businessName, setBusinessName] = useState('')
  const [tagline, setTagline] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [whatsappPrefill, setWhatsappPrefill] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!config) return
    setBusinessName(config.businessName)
    setTagline(config.tagline)
    setWhatsappNumber(config.whatsappNumber)
    setPhone(config.phone)
    setEmail(config.email)
    setInstagramHandle(config.instagramHandle)
    setWhatsappPrefill(config.whatsappPrefill)
    setSeoTitle(config.seoTitle)
    setSeoDescription(config.seoDescription)
  }, [config])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('')
    setError('')
    try {
      await updateSiteConfig({
        businessName: businessName.trim(),
        tagline: tagline.trim(),
        whatsappNumber: whatsappNumber.trim(),
        phone: phone.trim(),
        email: email.trim(),
        instagramHandle: instagramHandle.trim().replace(/^@/, ''),
        whatsappPrefill: whatsappPrefill.trim(),
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
      })
      await refresh()
      setStatus('Website settings saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="ss-portal-header">
        <div>
          <p className="ss-eyebrow">Website Settings</p>
          <h1 className="ss-display ss-display-md">Update your public website</h1>
        </div>
      </div>

      <form className="ss-form ss-portal-panel" onSubmit={onSave}>
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
          <div>
            <label className="form-label" htmlFor="cfg-ig">
              Instagram handle
            </label>
            <input
              id="cfg-ig"
              className="form-control"
              placeholder="without @"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
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

        {status ? <p className="ss-portal-status">{status}</p> : null}
        {error ? <p className="ss-portal-status is-error">{error}</p> : null}

        <button className="ss-btn ss-btn-primary mt-3" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </>
  )
}
