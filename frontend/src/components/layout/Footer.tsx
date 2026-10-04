import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { SocialIcon } from '../brand/SocialIcon'
import { useAuth } from '../../providers/AuthProvider'
import { useSiteConfig } from '../../providers/SiteConfigProvider'
import { activeSocialLinks, mailtoHref, telHref, whatsappUrl } from '../../lib/contactLinks'
import {
  isSocialPlatform,
  SOCIAL_PLATFORMS,
  type SocialPlatformId,
} from '../../lib/socialPlatforms'
import type { FooterLink } from '../../api/config'

const defaultServices: FooterLink[] = [
  { label: 'Automotive', href: '/#services' },
  { label: 'Commercial', href: '/#services' },
  { label: 'Residential', href: '/#services' },
]

const defaultNavigate: FooterLink[] = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Our Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
]

function FooterNavLink({ link }: { link: FooterLink }) {
  if (link.href.startsWith('/#') || link.href.startsWith('#')) {
    return <a href={link.href}>{link.label}</a>
  }
  if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer">
        {link.label}
      </a>
    )
  }
  return <Link to={link.href}>{link.label}</Link>
}

function platformName(platform: string) {
  return SOCIAL_PLATFORMS.find((item) => item.id === platform)?.name ?? platform
}

export function Footer() {
  const { user } = useAuth()
  const { config } = useSiteConfig()
  const wa = whatsappUrl(config)
  const tel = telHref(config)
  const mail = mailtoHref(config)
  const socialLinks = activeSocialLinks(config)
    .filter((link): link is { platform: SocialPlatformId; url: string } =>
      isSocialPlatform(link.platform),
    )
  const name = config?.businessName ?? 'S&S Window Tinting'
  const tagline = config?.tagline ?? 'Professional Window Tinting'
  const categories = config?.footerCategories?.trim() || 'Automotive / Commercial / Residential'
  const copyright =
    config?.footerCopyright?.trim() || `© ${new Date().getFullYear()} ${name}. All rights reserved.`
  const servicesTitle = config?.footerServicesTitle?.trim() || 'Services'
  const navigateTitle = config?.footerNavigateTitle?.trim() || 'Navigate'
  const connectTitle = config?.footerConnectTitle?.trim() || 'Connect'
  const services = config?.footerServices?.length ? config.footerServices : defaultServices
  const navigate = config?.footerNavigate?.length ? config.footerNavigate : defaultNavigate
  const showPrivacy = config?.footerShowPrivacy ?? true
  const showCookies = config?.footerShowCookies ?? true
  const showTerms = config?.footerShowTerms ?? true
  const hasLegal = showPrivacy || showCookies || showTerms
  const hasConnect = Boolean(tel || wa || mail || socialLinks.length)

  return (
    <footer className="ss-footer" id="ss-site-footer">
      <div className="ss-container">
        <div className="ss-footer-grid">
          <div className="ss-footer-brand">
            <Link className="ss-logo" to="/" aria-label={name}>
              <Logo />
            </Link>
            <p>{tagline}</p>
            {categories ? <p className="mb-0 mt-2">{categories}</p> : null}
          </div>

          <div>
            <h4>{servicesTitle}</h4>
            <ul>
              {services.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{navigateTitle}</h4>
            <ul>
              {navigate.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <FooterNavLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{connectTitle}</h4>
            {socialLinks.length ? (
              <div className="ss-footer-social" aria-label="Social links">
                {socialLinks.map((link) => (
                  <a
                    key={`${link.platform}-${link.url}`}
                    className="ss-footer-social-link"
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={platformName(link.platform)}
                    title={platformName(link.platform)}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                ))}
              </div>
            ) : null}
            <ul>
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
              {!hasConnect ? (
                <li>
                  <a href="/#contact">Get a Quote</a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="ss-footer-bottom">
          <div className="ss-footer-legal">
            <span>{copyright}</span>
            {hasLegal ? (
              <nav className="ss-footer-policy-links" aria-label="Legal">
                {showPrivacy ? <Link to="/policies#privacy">Privacy</Link> : null}
                {showCookies ? <Link to="/policies#cookies">Cookies</Link> : null}
                {showTerms ? <Link to="/policies#terms">Terms</Link> : null}
              </nav>
            ) : null}
          </div>
          <Link className="ss-footer-admin" to={user ? '/admin' : '/?login=1'}>
            {user ? 'Portal' : 'Staff'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
