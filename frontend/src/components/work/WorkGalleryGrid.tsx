import { useState } from 'react'
import { Lightbox } from '../ui/Lightbox'
import type { GalleryItem } from '../../hooks/usePublicGallery'

type Props = {
  items: GalleryItem[]
  emptyMessage?: string
}

export function WorkGalleryGrid({ items, emptyMessage }: Props) {
  const [active, setActive] = useState<GalleryItem | null>(null)

  if (items.length === 0) {
    return <p className="ss-muted-note mt-4 mb-0">{emptyMessage ?? 'No project photos yet.'}</p>
  }

  return (
    <>
      <div className="ss-gallery">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ss-gallery-item"
            onClick={() => setActive(item)}
            aria-label={`Open larger view: ${item.alt}`}
          >
            <img src={item.src} alt={item.alt} loading="lazy" />
          </button>
        ))}
      </div>

      {active ? (
        <Lightbox src={active.src} alt={active.alt} onClose={() => setActive(null)} />
      ) : null}
    </>
  )
}
