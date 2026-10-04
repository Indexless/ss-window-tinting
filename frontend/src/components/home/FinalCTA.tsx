import { images } from '../../config/images'
import { Reveal } from '../ui/Reveal'
import { SkeletonImage } from '../ui/SkeletonImage'
import { useSiteConfig } from '../../providers/SiteConfigProvider'
import { whatsappUrl } from '../../lib/contactLinks'

export function FinalCTA() {
  const { config } = useSiteConfig()
  const wa = whatsappUrl(config)

  return (
    <section className="ss-final" aria-labelledby="final-cta-heading">
      <div className="ss-final-media" aria-hidden="true">
        <SkeletonImage src={images.finalCta} alt="" loading="lazy" fill />
        <div className="ss-final-overlay" />
      </div>
      <Reveal className="ss-final-content">
        <h2 className="ss-display ss-display-lg" id="final-cta-heading">
          Let&apos;s Get Your Windows Tinted.
        </h2>
        <p className="ss-lead mx-auto">Professional tinting for vehicles, homes and businesses.</p>
        <div className="ss-cta-row">
          <a className="ss-btn ss-btn-primary" href="#contact">
            Get a Quote
          </a>
          {wa ? (
            <a className="ss-btn ss-btn-whatsapp" href={wa} target="_blank" rel="noreferrer">
              WhatsApp Us
            </a>
          ) : null}
        </div>
      </Reveal>
    </section>
  )
}
