import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="ss-not-found">
        <div className="ss-container ss-not-found-inner">
          <p className="ss-eyebrow">404</p>
          <h1 className="ss-display ss-display-lg">Page not found</h1>
          <p className="ss-lead">
            That page doesn&apos;t exist. Head back home or request a quote.
          </p>
          <div className="ss-cta-row">
            <Link className="ss-btn ss-btn-primary" to="/">
              Back to Home
            </Link>
            <Link className="ss-btn ss-btn-ghost" to="/#contact">
              Get a Quote
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
