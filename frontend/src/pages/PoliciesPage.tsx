import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { useSiteConfig } from '../providers/SiteConfigProvider'

const sections = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'cookies', label: 'Cookie Policy' },
  { id: 'terms', label: 'Website Terms' },
]

export function PoliciesPage() {
  const { hash } = useLocation()
  const { config } = useSiteConfig()
  const name = config?.businessName ?? 'S&S Window Tinting'
  const email = config?.email?.trim()
  const phone = config?.phone?.trim()

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
              <h2 className="ss-display ss-display-md">Privacy Policy</h2>
              <p className="ss-muted-note">Last updated: 3 October 2026</p>

              <p>
                {name} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy and processes personal
                information in line with South Africa&apos;s Protection of Personal Information Act 4 of
                2013 (POPIA).
              </p>

              <h3>Responsible party</h3>
              <p>
                {name} is the responsible party for personal information collected through this website
                and related quote enquiries.
                {email ? (
                  <>
                    {' '}
                    Contact us at <a href={`mailto:${email}`}>{email}</a>
                    {phone ? (
                      <>
                        {' '}
                        or <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
                      </>
                    ) : null}
                    .
                  </>
                ) : (
                  <> Use the quote form on this website to contact us about privacy requests.</>
                )}
              </p>

              <h3>What we collect</h3>
              <p>Depending on how you contact us, we may collect:</p>
              <ul>
                <li>Identity and contact details (name, phone or WhatsApp number, email address)</li>
                <li>Enquiry details (service type, vehicle or property information, message content)</li>
                <li>Preferred contact method and any notes you choose to share</li>
                <li>
                  Technical information needed to run the site securely (for example cookie identifiers
                  for staff sign-in)
                </li>
              </ul>

              <h3>Why we process your information</h3>
              <p>We process personal information to:</p>
              <ul>
                <li>Respond to quote requests and schedule or deliver window tinting services</li>
                <li>Communicate with you using your preferred contact method</li>
                <li>Keep records needed for customer service, safety, and legal compliance</li>
                <li>
                  Send marketing updates only if you have given separate, optional consent
                </li>
              </ul>
              <p>
                Our lawful bases include consent (where you tick the privacy notice on the quote form),
                and performance of a contract or steps taken at your request before entering a contract
                when you ask for a quote or service.
              </p>

              <h3>Who we share information with</h3>
              <p>
                We do not sell your personal information. We may share it with trusted service providers
                who help us host this website, send communications, or operate our business, and only
                as needed for those purposes. We may also disclose information if required by law.
              </p>

              <h3>Retention</h3>
              <p>
                We keep enquiry and customer records for as long as reasonably needed to handle your
                request, provide services, resolve disputes, and meet legal or accounting duties. When
                information is no longer needed, we delete or de-identify it where practicable.
              </p>

              <h3>Security</h3>
              <p>
                We take reasonable technical and organisational steps to protect personal information
                against loss, misuse, and unauthorised access. No online system is perfectly secure, so
                please avoid sending sensitive information that is not needed for your enquiry.
              </p>

              <h3>Your rights under POPIA</h3>
              <p>Subject to POPIA, you may request to:</p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Correct or update inaccurate or incomplete information</li>
                <li>Object to certain processing, or withdraw consent where processing is based on consent</li>
                <li>Ask us to delete or destroy information where we no longer have a lawful reason to keep it</li>
                <li>
                  Lodge a complaint with the Information Regulator (South Africa) at{' '}
                  <a href="https://inforegulator.org.za" target="_blank" rel="noreferrer">
                    inforegulator.org.za
                  </a>
                </li>
              </ul>
              <p>
                To exercise these rights, contact us using the details above. We may need to verify your
                identity before responding.
              </p>

              <h3>Children</h3>
              <p>
                This website and our services are aimed at adults and businesses. We do not knowingly
                collect personal information from children under 18 without a competent person&apos;s
                consent.
              </p>

              <h3>Updates</h3>
              <p>
                We may update this policy from time to time. The latest version will always be available
                on this page.
              </p>
            </section>

            <section id="cookies" className="ss-policy-block">
              <p className="ss-eyebrow">Cookies</p>
              <h2 className="ss-display ss-display-md">Cookie Policy</h2>
              <p className="ss-muted-note">Last updated: 3 October 2026</p>

              <p>
                Cookies are small text files stored on your device. {name} uses a limited set of cookies
                and similar technologies to operate this website.
              </p>

              <h3>Essential cookies</h3>
              <p>
                We use essential cookies for staff authentication and session security in the admin
                portal (for example HttpOnly access and refresh cookies). These cookies are required for
                the portal to work and are not used for advertising.
              </p>

              <h3>Preference storage</h3>
              <p>
                We may store a simple preference in your browser (such as whether you have acknowledged
                this cookie notice) so we do not show the notice on every visit.
              </p>

              <h3>Analytics and marketing cookies</h3>
              <p>
                We do not currently use third-party advertising or analytics cookies on this site. If that
                changes, we will update this policy and, where required, ask for your consent.
              </p>

              <h3>Managing cookies</h3>
              <p>
                You can control cookies through your browser settings. Blocking essential cookies may
                prevent staff from signing in to the portal.
              </p>
            </section>

            <section id="terms" className="ss-policy-block">
              <p className="ss-eyebrow">Terms</p>
              <h2 className="ss-display ss-display-md">Website Terms</h2>
              <p className="ss-muted-note">Last updated: 3 October 2026</p>

              <p>
                By using this website you agree to these terms. If you do not agree, please do not use
                the site.
              </p>

              <h3>About this site</h3>
              <p>
                This website provides information about {name}&apos;s automotive, commercial, and
                residential window tinting services and allows you to request a quote. Quotes and
                availability are subject to confirmation by us.
              </p>

              <h3>Accuracy of information</h3>
              <p>
                We aim to keep website content accurate and up to date, but information may change
                without notice. Photos and examples are for illustration and may not reflect every
                finished job.
              </p>

              <h3>Quotes and services</h3>
              <p>
                Submitting a quote request does not create a binding contract. Pricing, scheduling, and
                service scope are confirmed when we respond and when you accept our offer. Film choice,
                vehicle or property condition, and site access can affect the final quote.
              </p>

              <h3>Acceptable use</h3>
              <p>
                You may not misuse this website, attempt unauthorised access to the admin portal, submit
                false or harmful content, or use the site in a way that breaches applicable law.
              </p>

              <h3>Intellectual property</h3>
              <p>
                Branding, text, design, and media on this site belong to {name} or our licensors. You
                may not copy or reuse them without permission, except for personal, non-commercial
                viewing.
              </p>

              <h3>Liability</h3>
              <p>
                To the extent permitted by South African law, we are not liable for indirect or
                consequential loss arising from use of this website. Nothing in these terms excludes
                liability that cannot lawfully be excluded.
              </p>

              <h3>Privacy</h3>
              <p>
                Personal information is handled according to our{' '}
                <a href="#privacy">Privacy Policy</a>.
              </p>

              <h3>Governing law</h3>
              <p>
                These terms are governed by the laws of the Republic of South Africa. Courts in South
                Africa have jurisdiction over disputes arising from these terms, subject to any rights
                you may have under consumer protection law.
              </p>
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
