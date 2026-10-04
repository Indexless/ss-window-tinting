import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/admin/config/business', label: 'Business' },
  { to: '/admin/config/faq', label: 'FAQ' },
  { to: '/admin/config/policies', label: 'Policies' },
  { to: '/admin/config/footer', label: 'Footer' },
]

export function ConfigLayout() {
  return (
    <>
      <div className="ss-portal-header">
        <div>
          <p className="ss-eyebrow">Website Settings</p>
          <h1 className="ss-display ss-display-md">Update your public website</h1>
        </div>
      </div>

      <nav className="ss-config-tabs" aria-label="Settings sections">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => (isActive ? 'is-active' : undefined)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </>
  )
}
