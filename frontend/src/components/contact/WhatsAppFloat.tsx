import { useEffect, useId, useState } from 'react'
import { useSiteConfig } from '../../providers/SiteConfigProvider'
import { whatsappUrl } from '../../lib/contactLinks'

function WhatsAppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.1.55 4.15 1.6 5.95L0 24l6.35-1.65a11.8 11.8 0 0 0 5.7 1.45h.05c6.55 0 11.85-5.3 11.85-11.85 0-3.15-1.25-6.15-3.45-8.45ZM12.05 21.7h-.05a9.8 9.8 0 0 1-5-1.35l-.35-.2-3.75 1 1-3.65-.25-.375a9.8 9.8 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.85-9.8 2.65 0 5.1 1.05 6.95 2.9a9.7 9.7 0 0 1 2.9 6.95c0 5.4-4.4 9.8-9.8 9.8Zm5.4-7.35c-.3-.15-1.75-.85-2.02-.95-.27-.1-.47-.15-.67.15-.2.3-.77.95-.95 1.15-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.4-1.45-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.25 5.15 4.55 1.9.82 2.65.9 3.6.75.58-.09 1.75-.72 2-1.4.25-.7.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  )
}

export function WhatsAppFloat() {
  const { config } = useSiteConfig()
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)
  const [overFooter, setOverFooter] = useState(false)
  const panelId = useId()
  const wa = whatsappUrl(config)

  useEffect(() => {
    if (open) {
      const id = window.requestAnimationFrame(() => setShown(true))
      return () => window.cancelAnimationFrame(id)
    }
    setShown(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const footer = document.getElementById('ss-site-footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting)
        setOverFooter(visible)
        if (visible) setOpen(false)
      },
      { root: null, threshold: 0.05 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  if (!wa || overFooter) return null

  return (
    <div className={`ss-wa-float ${open ? 'is-open' : ''} ${shown ? 'is-shown' : ''}`}>
      <div
        id={panelId}
        className="ss-wa-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby={`${panelId}-title`}
        aria-hidden={!open}
      >
        <div className="ss-wa-panel-inner">
          <button
            type="button"
            className="ss-wa-panel-close"
            aria-label="Close WhatsApp panel"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          <p className="ss-eyebrow mb-2">Prefer WhatsApp?</p>
          <h2 className="ss-display ss-display-md" id={`${panelId}-title`}>
            Chat With Us
          </h2>
          <p className="ss-wa-panel-copy">
            Fast replies for quotes and scheduling. Send us a message anytime.
          </p>
          <a className="ss-btn ss-btn-whatsapp w-100" href={wa} target="_blank" rel="noreferrer">
            WhatsApp Us
          </a>
        </div>
      </div>

      <button
        type="button"
        className="ss-floating-wa"
        aria-label={open ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`ss-wa-icon ${open ? 'is-hidden' : ''}`}>
          <WhatsAppIcon />
        </span>
        <span className={`ss-wa-x ${open ? 'is-visible' : ''}`} aria-hidden="true">
          ✕
        </span>
      </button>
    </div>
  )
}
