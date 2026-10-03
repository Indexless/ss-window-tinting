import { useSiteConfig } from '../../providers/SiteConfigProvider'
import { whatsappUrl } from '../../lib/contactLinks'

export function MobileCtaBar() {
  const { config } = useSiteConfig()
  const wa = whatsappUrl(config)

  return (
    <div className="ss-mobile-cta-bar" aria-label="Quick contact">
      <a className="ss-btn ss-btn-primary" href="#contact">
        Get a Quote
      </a>
      {wa ? (
        <a className="ss-btn ss-btn-whatsapp" href={wa} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      ) : null}
    </div>
  )
}
