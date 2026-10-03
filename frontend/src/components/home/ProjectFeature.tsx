import { images } from '../../config/images'
import { Reveal } from '../ui/Reveal'

export function ProjectFeature() {
  return (
    <section className="ss-featured" aria-labelledby="featured-heading">
      <div className="ss-featured-media ss-media">
        <img src={images.featured} alt="Premium vehicle with professional window tint" loading="lazy" />
      </div>
      <div className="ss-featured-copy">
        <Reveal>
          <p className="ss-eyebrow">Featured Work</p>
          <h2 className="ss-display ss-display-md" id="featured-heading">
            Built to Look Good.
            <br />
            Tinted to Perform.
          </h2>
          <hr className="ss-rule" />
          <p className="ss-lead" style={{ marginTop: 0 }}>
            Professional window tinting can completely change the appearance of a vehicle while adding
            comfort and privacy to every drive.
          </p>
          <div className="ss-cta-row">
            <a className="ss-btn ss-btn-primary" href="#contact">
              Get Your Vehicle Tinted
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
