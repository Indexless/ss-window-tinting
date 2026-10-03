import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="ss-admin-shell">
        <p className="ss-muted-note">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/?login=1" replace />
  }

  return <Outlet />
}
