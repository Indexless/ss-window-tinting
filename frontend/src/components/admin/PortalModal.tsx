import { useEffect, type ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  eyebrow?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function PortalModal({ open, title, eyebrow, onClose, children, wide }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="ss-portal-modal" role="dialog" aria-modal="true" aria-labelledby="ss-portal-modal-title">
      <button type="button" className="ss-portal-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className={`ss-portal-modal-card ss-glass ${wide ? 'is-wide' : ''}`}>
        <button type="button" className="ss-portal-modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        {eyebrow ? <p className="ss-eyebrow mb-2">{eyebrow}</p> : null}
        <h2 className="ss-display ss-display-md" id="ss-portal-modal-title">
          {title}
        </h2>
        <div className="ss-portal-modal-body">{children}</div>
      </div>
    </div>
  )
}
