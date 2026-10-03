import { images } from '../../config/images'
import { Reveal } from '../ui/Reveal'

const features = [
  { num: '01', title: 'Professional Installation' },
  { num: '02', title: 'Automotive, Commercial & Residential' },
  { num: '03', title: 'Mobile Service' },
  { num: '04', title: 'Established Since 2019' },
]

export function WhySS() {
  return (
    <section className="ss-why" aria-labelledby="why-heading">
      <div className="ss-why-media ss-media">
        <img
          src={images.whySs}
          alt="Professional window tinting installation"
          loading="lazy"
        />
      </div>
      <div className="ss-why-copy">
        <Reveal>
          <p className="ss-eyebrow">Why S&S?</p>
          <h2 className="ss-display ss-display-md" id="why-heading">
            Professional Results.
            <br />
            Personal Service.
          </h2>
          <hr className="ss-rule" />
          <p className="ss-lead" style={{ marginTop: 0 }}>
            Since 2019, S&S Window Tinting has provided professional window tinting for automotive,
            commercial and residential customers.
          </p>
          <p className="ss-lead">
            Whether you&apos;re looking to transform the look of your vehicle, improve privacy at home
            or create a more comfortable commercial environment, we focus on delivering a clean,
            professional finish.
          </p>
          <div className="ss-feature-list">
            {features.map((f) => (
              <div className="ss-feature" key={f.num}>
                <span className="ss-feature-num">{f.num}</span>
                <h4>{f.title}</h4>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
