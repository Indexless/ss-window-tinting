import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { MobileCtaBar } from '../components/layout/MobileCtaBar'
import { WhatsAppFloat } from '../components/contact/WhatsAppFloat'
import { Reveal } from '../components/ui/Reveal'
import { GallerySkeleton } from '../components/ui/GallerySkeleton'
import { WorkGalleryGrid } from '../components/work/WorkGalleryGrid'
import { usePublicGallery } from '../hooks/usePublicGallery'

export function WorkPage() {
  const { gallery, loading } = usePublicGallery()

  return (
    <>
      <Header />
      <main className="ss-work-page">
        <section className="ss-section">
          <div className="ss-container">
            <Reveal>
              <p className="ss-eyebrow">Our Work</p>
              <h1 className="ss-display ss-display-lg">See the Difference.</h1>
            </Reveal>

            {loading ? (
              <GallerySkeleton />
            ) : (
              <WorkGalleryGrid items={gallery} />
            )}

            <Reveal className="ss-cta-row" style={{ justifyContent: 'center' }}>
              <Link className="ss-btn ss-btn-ghost" to="/">
                Back to Home
              </Link>
              <Link className="ss-btn ss-btn-primary" to="/#contact">
                Get a Quote
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCtaBar />
      <WhatsAppFloat />
    </>
  )
}
