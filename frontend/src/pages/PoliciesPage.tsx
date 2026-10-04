import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { PolicyBody } from '../components/content/PolicyBody'
import { useSiteConfig } from '../providers/SiteConfigProvider'

export function PoliciesPage() {
  const { hash } = useLocation()
  const { config } = useSiteConfig()
  const name = config?.businessName ?? 'S&S Window Tinting'
  const privacy = config?.policyPrivacy
  const cookies = config?.policyCookies
  const terms = config?.policyTerms

  const sections = [
    { id: 'privacy', label: privacy?.title || 'Privacy Policy' },
    { id: 'cookies', label: cookies?.title || 'Cookie Policy' },
    { id: 'terms', label: terms?.title || 'Website Terms' },
  ]

  useEffect(() => {
    const id = hash.replace('#', '')
    if (!id) return
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <>
      <Header />
      <main className="ss-policies">
        <div className="ss-container ss-policies-layout">
          <aside className="ss-policies-nav" aria-label="Policies">
            <p className="ss-eyebrow">Legal</p>
            <h1 className="ss-display ss-display-md">Policies</h1>
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.label}</a>
                </li>
              ))}
            </ul>
            <Link className="ss-btn ss-btn-ghost mt-3" to="/">
              Back to Home
            </Link>
          </aside>

          <div className="ss-policies-content">
            <section id="privacy" className="ss-policy-block">
              <p className="ss-eyebrow">POPIA</p>
              <h2 className="ss-display ss-display-md">{privacy?.title || 'Privacy Policy'}</h2>
              {privacy?.updatedAt ? (
                <p className="ss-muted-note">Last updated: {privacy.updatedAt}</p>
              ) : null}
              <PolicyBody body={privacy?.body || ''} businessName={name} />
            </section>

            <section id="cookies" className="ss-policy-block">
              <p className="ss-eyebrow">Cookies</p>
              <h2 className="ss-display ss-display-md">{cookies?.title || 'Cookie Policy'}</h2>
              {cookies?.updatedAt ? (
                <p className="ss-muted-note">Last updated: {cookies.updatedAt}</p>
              ) : null}
              <PolicyBody body={cookies?.body || ''} businessName={name} />
            </section>

            <section id="terms" className="ss-policy-block">
              <p className="ss-eyebrow">Terms</p>
              <h2 className="ss-display ss-display-md">{terms?.title || 'Website Terms'}</h2>
              {terms?.updatedAt ? (
                <p className="ss-muted-note">Last updated: {terms.updatedAt}</p>
              ) : null}
              <PolicyBody body={terms?.body || ''} businessName={name} />
            </section>

            <p className="ss-muted-note ss-policy-disclaimer">
              These pages are provided to help explain how {name} handles information and website use.
              They are not legal advice. Have them reviewed if you need formal legal sign-off.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
