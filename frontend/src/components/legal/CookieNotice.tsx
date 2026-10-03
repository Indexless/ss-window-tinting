import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'ss_cookie_notice_accepted'

export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Ignore storage failures; banner can reappear.
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="ss-cookie-notice" role="dialog" aria-label="Cookie notice">
      <div className="ss-cookie-notice-inner">
        <p>
          We use essential cookies to run this site and the staff portal. See our{' '}
          <Link to="/policies#cookies">Cookie Policy</Link> and{' '}
          <Link to="/policies#privacy">Privacy Policy</Link> for details.
        </p>
        <button type="button" className="ss-btn ss-btn-primary" onClick={accept}>
          Got it
        </button>
      </div>
    </div>
  )
}
