import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { useAuth } from '../../providers/AuthProvider'

type Props = {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: Props) {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    if (user) {
      onClose()
      navigate('/admin', { replace: true })
    }
  }, [open, user, navigate, onClose])

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

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      onClose()
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="ss-login-modal" role="dialog" aria-modal="true" aria-labelledby="ss-login-title">
      <button type="button" className="ss-login-modal-backdrop" aria-label="Close sign in" onClick={onClose} />
      <div className="ss-login-card ss-glass">
        <button type="button" className="ss-login-modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <div className="ss-logo mb-4 d-inline-flex">
          <Logo />
        </div>
        <p className="ss-eyebrow">Staff</p>
        <h2 className="ss-display ss-display-md" id="ss-login-title">
          Sign In
        </h2>
        <p className="ss-muted-note mt-2 mb-4">Sign in to your account.</p>

        <form className="ss-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="form-control"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="form-control"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-danger small mb-3">{error}</p> : null}
          <button className="ss-btn ss-btn-primary w-100" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
