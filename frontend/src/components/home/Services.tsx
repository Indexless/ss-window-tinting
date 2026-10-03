import { images } from '../../config/images'
import { Reveal } from '../ui/Reveal'

const services = [
  {
    title: 'Automotive Window Tinting',
    copy: 'Upgrade your vehicle with professional window tinting that enhances privacy, comfort and the overall look of your car.',
    image: images.automotive,
    alt: 'Professionally tinted premium vehicle',
  },
  {
    title: 'Commercial Window Tinting',
    copy: 'Improve comfort, privacy and the appearance of commercial spaces with professional window tinting solutions.',
    image: images.commercial,
    alt: 'Modern commercial building with tinted glass',
  },
  {
    title: 'Residential Window Tinting',
    copy: 'Create a more comfortable and private home while giving your windows a clean, modern finish.',
    image: images.residential,
    alt: 'Modern home with large tinted windows',
  },
]

export function Services() {
  return (
    <section className="ss-section" id="services">
      <div className="ss-container">
        <Reveal>
          <p className="ss-eyebrow">Services</p>
          <h2 className="ss-display ss-display-lg">
            One Service.
            <br />
            Three Ways to Upgrade Your Space.
          </h2>
          <p className="ss-lead">
            From your daily drive to your home or workplace, S&S Window Tinting provides professional
            tinting solutions designed around your needs.
          </p>
        </Reveal>

        <div className="ss-service-grid">
          {services.map((service) => (
            <Reveal key={service.title} as="article" className="ss-service-card">
              <img src={service.image} alt={service.alt} loading="lazy" />
              <div className="ss-service-body">
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <a className="ss-btn ss-btn-ghost" href="#contact">
                  Learn More
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
