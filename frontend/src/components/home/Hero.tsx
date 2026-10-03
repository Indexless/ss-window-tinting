import { images } from '../../config/images'

export function Hero() {
  return (
    <section className="ss-hero" id="home" aria-label="Hero">
      <div className="ss-hero-media" aria-hidden="true">
        <img src={images.hero} alt="" fetchPriority="high" />
        <div className="ss-hero-overlay" />
      </div>

      <div className="ss-hero-content">
        <h1 className="ss-display ss-display-xl">
          Professional Window
          <br />
          Tinting.
          <br />
          Done Right.
        </h1>
        <p className="ss-lead">
          Premium tinting for vehicles, homes and businesses. Installed clean, finished right.
        </p>
        <div className="ss-cta-row">
          <a className="ss-btn ss-btn-primary" href="#contact">
            Get a Quote
          </a>
          <a className="ss-btn ss-btn-ghost" href="#work">
            View Our Work
          </a>
        </div>
        <p className="ss-hero-meta">Est. 2019 · Automotive · Commercial · Residential</p>
      </div>
    </section>
  )
}
