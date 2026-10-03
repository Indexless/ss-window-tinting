import { useAuth } from '../../providers/AuthProvider'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="ss-portal-header">
      <div>
        <p className="ss-eyebrow">Home</p>
        <h1 className="ss-display ss-display-md">Welcome, {user?.name}</h1>
      </div>
    </div>
  )
}
