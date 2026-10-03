import Accordion from 'react-bootstrap/Accordion'
import { Reveal } from '../ui/Reveal'

const faqs = [
  {
    q: 'What types of window tinting do you offer?',
    a: 'S&S Window Tinting handles automotive, commercial, and residential jobs. Whether it is a vehicle, home, or business space, tell us what you need tinted and we will recommend a suitable approach.',
  },
  {
    q: 'How long does window tinting take?',
    a: 'Most vehicles take about 1 to 4 hours, depending on the car and whether old film needs removing first. Homes often take a few hours based on how many windows are involved. Larger commercial projects can take a day or more. We will confirm timing when we quote your job.',
  },
  {
    q: 'Do I need to keep my windows up after a car tint?',
    a: 'Yes. Keep tinted windows fully closed for at least 2 to 3 days so the film can bond properly. Rolling them down too soon is a common cause of edge lifting. Exact aftercare tips will depend on the film and weather on the day of install.',
  },
  {
    q: 'Why do my windows look hazy or have small bubbles after tinting?',
    a: 'A hazy, streaky, or blotchy look is normal at first. Moisture left between the film and the glass needs time to evaporate as the film cures. Small water pockets usually clear on their own over the following days or weeks. Do not press, poke, or scrape the film while it is curing.',
  },
  {
    q: 'How should I clean tinted windows?',
    a: 'Wait at least a week before cleaning the film side, and longer if we advise a full cure period. Use a soft cloth or microfiber and an ammonia-free cleaner. Avoid blades, abrasive pads, and harsh chemicals, as they can scratch or damage the film.',
  },
  {
    q: 'How do I request a quote?',
    a: 'Use the quote form on this site and include the service type, vehicle or property details, and what you want tinted. We also offer mobile tinting where the job allows. Submit your request and we will follow up with you.',
  },
]

export function FAQ() {
  return (
    <section className="ss-section" id="faq">
      <div className="ss-container">
        <Reveal>
          <p className="ss-eyebrow">FAQ</p>
          <h2 className="ss-display ss-display-lg">Questions, Answered.</h2>
          <p className="ss-lead">
            Common tinting questions, with clear next steps when your job needs a custom quote.
          </p>
        </Reveal>

        <Reveal className="ss-faq mt-4">
          <Accordion flush>
            {faqs.map((item, index) => (
              <Accordion.Item eventKey={String(index)} key={item.q}>
                <Accordion.Header>{item.q}</Accordion.Header>
                <Accordion.Body>{item.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
