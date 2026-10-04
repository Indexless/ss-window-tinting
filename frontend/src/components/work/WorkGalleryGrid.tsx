import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Lottie } from 'lottie-react'
import { Lightbox } from '../ui/Lightbox'
import { SkeletonImage } from '../ui/SkeletonImage'
import type { GalleryItem } from '../../hooks/usePublicGallery'
import swipeHintAnimation from '../../assets/lottie/swipe-hint.json'

const IDLE_HINT_MS = 10_000
const MOBILE_QUERY = '(max-width: 767.98px)'

type Props = {
  items: GalleryItem[]
  emptyMessage?: string
}

export function WorkGalleryGrid({ items, emptyMessage }: Props) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false,
  )
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: items.length > 1,
    dragFree: false,
    containScroll: 'trimSnaps',
    active: isMobile,
    breakpoints: {
      '(min-width: 768px)': { active: false },
    },
  })
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState<GalleryItem | null>(null)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)

  const dismissHint = useCallback(() => {
    setShowSwipeHint(false)
    setHintDismissed(true)
  }, [])

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY)
    const onChange = () => {
      setIsMobile(media.matches)
      if (!media.matches) {
        setShowSwipeHint(false)
      }
    }
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!emblaApi || !isMobile) return

    const onSelect = () => setIndex(emblaApi.selectedScrollSnap())
    const onPointerDown = () => dismissHint()

    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('pointerDown', onPointerDown)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
      emblaApi.off('pointerDown', onPointerDown)
    }
  }, [emblaApi, dismissHint, isMobile])

  useEffect(() => {
    if (!isMobile || items.length < 2 || hintDismissed || active) {
      setShowSwipeHint(false)
      return
    }

    setShowSwipeHint(false)
    const timer = window.setTimeout(() => setShowSwipeHint(true), IDLE_HINT_MS)
    return () => window.clearTimeout(timer)
  }, [index, items.length, hintDismissed, active, isMobile])

  if (items.length === 0) {
    return <p className="ss-muted-note mt-4 mb-0">{emptyMessage ?? 'No project photos yet.'}</p>
  }

  return (
    <>
      <div
        className={`ss-carousel ${isMobile ? 'is-mobile' : 'is-grid'}`}
        aria-roledescription={isMobile ? 'carousel' : undefined}
        aria-label="Our work gallery"
      >
        <div className="ss-carousel-viewport" ref={emblaRef}>
          <div className="ss-carousel-track">
            {items.map((item, i) => (
              <div className="ss-carousel-slide" key={item.id}>
                <button
                  type="button"
                  className="ss-gallery-item"
                  onClick={() => {
                    dismissHint()
                    setActive(item)
                  }}
                  aria-label={`Open larger view: ${item.alt}`}
                  aria-roledescription={isMobile ? 'slide' : undefined}
                  aria-current={isMobile && i === index ? 'true' : undefined}
                >
                  <SkeletonImage
                    src={item.src}
                    alt={item.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {isMobile && items.length > 1 && showSwipeHint ? (
          <div className="ss-swipe-hint" role="status" aria-live="polite">
            <Lottie className="ss-swipe-hint-lottie" src={swipeHintAnimation} loop autoplay />
            <span>Swipe for more</span>
          </div>
        ) : null}

        {isMobile && items.length > 1 ? (
          <div className="ss-carousel-dots" role="tablist" aria-label="Gallery slides">
            {items.map((item, i) => (
              <button
                key={`dot-${item.id}`}
                type="button"
                className={`ss-carousel-dot ${i === index ? 'is-active' : ''}`}
                aria-label={`Go to project ${i + 1}`}
                aria-selected={i === index}
                onClick={() => {
                  dismissHint()
                  emblaApi?.scrollTo(i)
                }}
              />
            ))}
          </div>
        ) : null}
      </div>

      {active ? (
        <Lightbox src={active.src} alt={active.alt} onClose={() => setActive(null)} />
      ) : null}
    </>
  )
}
