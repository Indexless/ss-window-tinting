import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { useAuth } from '../../providers/AuthProvider'

const links = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/leads', end: false, label: 'Leads' },
  { to: '/admin/gallery', end: false, label: 'Gallery' },
  { to: '/admin/users', end: false, label: 'Users' },
  { to: '/admin/config', end: false, label: 'Website Settings' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="ss-portal">
      <aside className="ss-portal-sidebar">
        <div className="ss-portal-brand">
          <NavLink to="/admin" className="ss-logo" aria-label="Admin home">
            <Logo />
          </NavLink>
          <small>Admin Portal</small>
        </div>

        <nav className="ss-portal-nav" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ss-portal-content">
        <header className="ss-portal-topbar">
          <p className="ss-portal-topbar-title">S&S Window Tinting</p>

          <div className="ss-portal-user-menu" ref={menuRef}>
            <button
              type="button"
              className="ss-portal-user-button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="ss-portal-user-meta">
                <strong>{user?.name ?? 'Account'}</strong>
                <small>{user?.email}</small>
              </span>
              <span className="ss-portal-user-caret" aria-hidden="true">
                ▾
              </span>
            </button>

            {menuOpen ? (
              <div className="ss-portal-user-dropdown" role="menu">
                <Link
                  to="/"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Home page
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    void logout()
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="ss-portal-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
