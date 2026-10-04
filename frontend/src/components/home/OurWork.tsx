import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'
import { GallerySkeleton } from '../ui/GallerySkeleton'
import { WorkGalleryGrid } from '../work/WorkGalleryGrid'
import { usePublicGallery } from '../../hooks/usePublicGallery'

const HOME_GALLERY_LIMIT = 4

export function OurWork() {
  const { gallery, loading } = usePublicGallery()
  const preview = gallery.slice(0, HOME_GALLERY_LIMIT)

  return (
    <section className="ss-section" id="work">
      <div className="ss-container">
        <Reveal>
          <p className="ss-eyebrow">Our Work</p>
          <h2 className="ss-display ss-display-lg">See the Difference.</h2>
        </Reveal>

        {loading ? (
          <GallerySkeleton />
        ) : (
          <WorkGalleryGrid items={preview} />
        )}

        <Reveal className="ss-cta-row" style={{ justifyContent: 'center' }}>
          <Link className="ss-btn ss-btn-ghost" to="/work">
            View All Work
          </Link>
          <Link className="ss-btn ss-btn-primary" to="/#contact">
            Get a Quote
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
