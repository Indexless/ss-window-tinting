import { images } from '../../config/images'
import { SkeletonImage } from '../ui/SkeletonImage'

export function Hero() {
  return (
    <section className="ss-hero" id="home" aria-label="Hero">
      <div className="ss-hero-media" aria-hidden="true">
        <SkeletonImage src={images.hero} alt="" fetchPriority="high" fill />
        <div className="ss-hero-overlay" />
      </div>

      <div className="ss-hero-content">
        <h1 className="ss-display ss-display-xl">
          Less Heat.
          <br />
          Less Glare.
          <br />
          More Privacy.
        </h1>
        <p className="ss-lead">
          Professional window tinting for cars, homes and businesses, fitted with a clean,
          bubble-free finish. Mobile service available, so we can come to you.
        </p>
        <div className="ss-cta-row">
          <a className="ss-btn ss-btn-primary" href="#contact">
            Get a Quote
          </a>
          <a className="ss-btn ss-btn-ghost" href="#work">
            View Our Work
          </a>
        </div>
      </div>
    </section>
  )
}
