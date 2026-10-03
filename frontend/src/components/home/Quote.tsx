import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitWebsiteLead } from '../../api/leads'
import { Reveal } from '../ui/Reveal'
import { useSiteConfig } from '../../providers/SiteConfigProvider'
import { whatsappUrl } from '../../lib/contactLinks'

type FormState = {
  name: string
  phone: string
  email: string
  service: string
  propertyType: string
  preferredContact: string
  message: string
  privacyConsent: boolean
}

const initial: FormState = {
  name: '',
  phone: '',
  email: '',
  service: '',
  propertyType: '',
  preferredContact: 'WhatsApp',
  message: '',
  privacyConsent: false,
}

export function Quote() {
  const { config } = useSiteConfig()
  const [form, setForm] = useState<FormState>(initial)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const wa = whatsappUrl(config)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (!form.privacyConsent) {
        setError('Please accept the privacy notice before submitting.')
        setSubmitting(false)
        return
      }
      await submitWebsiteLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        service: form.service,
        propertyType: form.propertyType.trim(),
        preferredContact: form.preferredContact,
        message: form.message.trim(),
        privacyConsent: true,
        marketingConsent: false,
      })
      setSubmitted(true)
      setForm(initial)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="ss-section ss-quote" id="contact">
      <div className="ss-container">
        <div className="ss-quote-grid">
          <Reveal>
            <p className="ss-eyebrow">Quote</p>
            <h2 className="ss-display ss-display-lg">Ready for a Tint?</h2>
            <p className="ss-lead">
              Tell us what you&apos;re looking to tint and we&apos;ll help you find the right solution.
            </p>

            <form className="ss-form ss-quote-panel ss-glass mt-4" onSubmit={onSubmit}>
              {submitted ? (
                <p className="mb-0">
                  Thanks, we&apos;ve received your request and will be in touch soon.
                </p>
              ) : (
                <div className="ss-form-grid">
                  <div className="ss-form-grid ss-form-grid-2">
                    <div>
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                      <input
                        id="name"
                        className="form-control"
                        required
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="phone">
                        Phone / WhatsApp
                      </label>
                      <input
                        id="phone"
                        className="form-control"
                        required
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      required
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                  </div>
                  <div className="ss-form-grid ss-form-grid-2">
                    <div>
                      <label className="form-label" htmlFor="service">
                        Service
                      </label>
                      <select
                        id="service"
                        className="form-select"
                        required
                        value={form.service}
                        onChange={(e) => update('service', e.target.value)}
                      >
                        <option value="">Select service</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Residential">Residential</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" htmlFor="propertyType">
                        Vehicle / Property Type
                      </label>
                      <input
                        id="propertyType"
                        className="form-control"
                        placeholder="e.g. SUV, office, home"
                        value={form.propertyType}
                        onChange={(e) => update('propertyType', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="preferredContact">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContact"
                      className="form-select"
                      value={form.preferredContact}
                      onChange={(e) => update('preferredContact', e.target.value)}
                    >
                      <option>WhatsApp</option>
                      <option>Phone</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="form-control"
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell us about the tint you're after"
                    />
                  </div>
                  <div className="ss-consent-stack">
                    <label className="ss-check">
                      <input
                        type="checkbox"
                        checked={form.privacyConsent}
                        onChange={(e) => update('privacyConsent', e.target.checked)}
                        required
                      />
                      <span>
                        I agree that S&S Window Tinting may use my details to respond to this quote
                        request, as explained in the{' '}
                        <Link to="/policies#privacy">Privacy Policy</Link>.
                      </span>
                    </label>
                  </div>
                  {error ? <p className="text-danger small mb-0">{error}</p> : null}
                  <button type="submit" className="ss-btn ss-btn-primary w-100" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Request a Quote'}
                  </button>
                </div>
              )}
            </form>
          </Reveal>

          <Reveal className="ss-quote-aside">
            <div className="ss-wa-card ss-glass">
              <p className="ss-eyebrow mb-2">Prefer WhatsApp?</p>
              <h3 className="ss-display ss-display-md mb-3">Chat With Us</h3>
              <p className="ss-muted-note mb-4">
                Fast replies for quotes and scheduling. Send us a message anytime.
              </p>
              {wa ? (
                <a className="ss-btn ss-btn-whatsapp w-100" href={wa} target="_blank" rel="noreferrer">
                  WhatsApp Us
                </a>
              ) : (
                <a className="ss-btn ss-btn-ghost w-100" href="#contact">
                  Use the quote form
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
