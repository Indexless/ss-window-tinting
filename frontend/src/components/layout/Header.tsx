import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../brand/Logo'

const links = [
  { hash: 'home', label: 'Home' },
  { hash: 'services', label: 'Services' },
  { hash: 'work', label: 'Our Work' },
  { hash: 'about', label: 'About' },
  { hash: 'faq', label: 'FAQ' },
  { hash: 'contact', label: 'Contact' },
]

export function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)
  const hrefFor = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`)

  return (
    <>
      <header className={`ss-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="ss-header-inner">
          <Link className="ss-logo" to="/" onClick={close} aria-label="S&S Window Tinting home">
            <Logo />
          </Link>

          <nav className="ss-nav" aria-label="Primary">
            {links.map((link) => (
              <a key={link.hash} href={hrefFor(link.hash)}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ss-header-actions">
            <a className="ss-btn ss-btn-primary ss-header-quote" href={hrefFor('contact')}>
              Get a Quote
            </a>
            <button
              type="button"
              className="ss-menu-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      <nav className={`ss-mobile-nav ${open ? 'is-open' : ''}`} aria-label="Mobile">
        {links.map((link) => (
          <a key={link.hash} href={hrefFor(link.hash)} onClick={close}>
            {link.label}
          </a>
        ))}
        <a className="ss-btn ss-btn-primary mt-3" href={hrefFor('contact')} onClick={close}>
          Get a Quote
        </a>
      </nav>
    </>
  )
}
