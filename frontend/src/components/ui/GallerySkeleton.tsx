export function GallerySkeleton() {
  return (
    <div className="ss-carousel is-grid" aria-busy="true" aria-label="Loading gallery">
      <div className="ss-carousel-viewport">
        <div className="ss-carousel-track">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="ss-carousel-slide" key={`gallery-skeleton-${index}`}>
              <div className="ss-gallery-item ss-gallery-item-skeleton">
                <span className="ss-skeleton" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
