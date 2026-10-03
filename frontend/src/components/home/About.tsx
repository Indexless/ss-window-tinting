import { Reveal } from '../ui/Reveal'

export function About() {
  return (
    <section className="ss-section ss-about" id="about">
      <div className="ss-container">
        <Reveal className="ss-about-inner">
          <p className="ss-eyebrow">About</p>
          <h2 className="ss-display ss-display-lg">About S&S</h2>
          <hr className="ss-rule" />
          <p className="ss-lead" style={{ marginTop: 0, maxWidth: '40rem' }}>
            Established in 2019, S&S Window Tinting provides professional and affordable window tinting
            services across automotive, commercial and residential applications.
          </p>
          <div className="ss-cta-row">
            <a className="ss-btn ss-btn-primary" href="#contact">
              Get a Quote
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
