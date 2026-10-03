import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { useAuth } from '../../providers/AuthProvider'
import { useSiteConfig } from '../../providers/SiteConfigProvider'
import { instagramUrl, mailtoHref, telHref, whatsappUrl } from '../../lib/contactLinks'

export function Footer() {
  const { user } = useAuth()
  const { config } = useSiteConfig()
  const wa = whatsappUrl(config)
  const tel = telHref(config)
  const mail = mailtoHref(config)
  const ig = instagramUrl(config)
  const name = config?.businessName ?? 'S&S Window Tinting'

  return (
    <footer className="ss-footer">
      <div className="ss-container">
        <div className="ss-footer-grid">
          <div className="ss-footer-brand">
            <Link className="ss-logo" to="/" aria-label={name}>
              <Logo />
            </Link>
            <p>{config?.tagline ?? 'Professional Window Tinting'}</p>
            <p className="mb-0 mt-2">Automotive · Commercial · Residential</p>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              <li>
                <a href="/#services">Automotive</a>
              </li>
              <li>
                <a href="/#services">Commercial</a>
              </li>
              <li>
                <a href="/#services">Residential</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Navigate</h4>
            <ul>
              <li>
                <a href="/#home">Home</a>
              </li>
              <li>
                <a href="/#services">Services</a>
              </li>
              <li>
                <a href="/#work">Our Work</a>
              </li>
              <li>
                <a href="/#about">About</a>
              </li>
              <li>
                <a href="/#faq">FAQ</a>
              </li>
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Connect</h4>
            <ul>
              {ig ? (
                <li>
                  <a href={ig} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
              ) : null}
              {tel ? (
                <li>
                  <a href={tel}>Phone</a>
                </li>
              ) : null}
              {wa ? (
                <li>
                  <a href={wa} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {mail ? (
                <li>
                  <a href={mail}>Email</a>
                </li>
              ) : null}
              {!ig && !tel && !wa && !mail ? (
                <li>
                  <a href="#contact">Get a Quote</a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="ss-footer-bottom">
          <div className="ss-footer-legal">
            <span>© 2026 {name}. All rights reserved.</span>
            <nav className="ss-footer-policy-links" aria-label="Legal">
              <Link to="/policies#privacy">Privacy</Link>
              <Link to="/policies#cookies">Cookies</Link>
              <Link to="/policies#terms">Terms</Link>
              <Link to="/sitemap">Sitemap</Link>
            </nav>
          </div>
          <Link className="ss-footer-admin" to={user ? '/admin' : '/?login=1'}>
            {user ? 'Portal' : 'Staff'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
