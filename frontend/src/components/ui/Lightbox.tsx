import { useEffect } from 'react'

type Props = {
  src: string
  alt: string
  onClose: () => void
}

export function Lightbox({ src, alt, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="ss-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="ss-lightbox-close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  )
}
