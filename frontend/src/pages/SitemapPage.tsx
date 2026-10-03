import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

const sections = [
  {
    title: 'Main',
    links: [
      { to: '/', label: 'Home' },
      { to: '/#services', label: 'Services' },
      { to: '/#work', label: 'Our Work (home preview)' },
      { to: '/work', label: 'All Work' },
      { to: '/#about', label: 'About' },
      { to: '/#faq', label: 'FAQ' },
      { to: '/#contact', label: 'Contact / Quote' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { to: '/policies', label: 'Policies' },
      { to: '/policies#privacy', label: 'Privacy Policy' },
      { to: '/policies#cookies', label: 'Cookie Policy' },
      { to: '/policies#terms', label: 'Website Terms' },
    ],
  },
]

export function SitemapPage() {
  return (
    <>
      <Header />
      <main className="ss-policies">
        <div className="ss-container">
          <p className="ss-eyebrow">Sitemap</p>
          <h1 className="ss-display ss-display-lg">Site map</h1>
          <p className="ss-lead">Quick links to every public page on this website.</p>

          <div className="ss-sitemap-grid">
            {sections.map((section) => (
              <section key={section.title} className="ss-sitemap-block">
                <h2 className="ss-display ss-display-md">{section.title}</h2>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
