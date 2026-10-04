import Accordion from 'react-bootstrap/Accordion'
import { Reveal } from '../ui/Reveal'
import { useSiteConfig } from '../../providers/SiteConfigProvider'

const fallbackFaqs = [
  {
    question: 'What types of window tinting do you offer?',
    answer:
      'S&S Window Tinting handles automotive, commercial, and residential jobs. Whether it is a vehicle, home, or business space, tell us what you need tinted and we will recommend a suitable approach.',
  },
]

export function FAQ() {
  const { config } = useSiteConfig()
  const faqs = config?.faq?.length ? config.faq : fallbackFaqs

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
              <Accordion.Item eventKey={String(index)} key={`${item.question}-${index}`}>
                <Accordion.Header>{item.question}</Accordion.Header>
                <Accordion.Body>{item.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
