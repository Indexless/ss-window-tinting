import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}

/** Scroll to top on route changes; honor hash targets. Same-page navbar hashes keep native section scroll. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const prev = useRef({ pathname, hash })

  useLayoutEffect(() => {
    const pathChanged = prev.current.pathname !== pathname
    const hashChanged = prev.current.hash !== hash
    prev.current = { pathname, hash }

    if (hash) {
      // Cross-page links like /work → /#contact need an explicit scroll after mount.
      // Same-page navbar hashes (#services, etc.) are left to the browser.
      if (!pathChanged) return

      const tryScroll = () => scrollToHash(hash, 'auto')
      if (tryScroll()) return

      const timer = window.setTimeout(() => {
        if (!tryScroll()) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }
      }, 80)
      return () => window.clearTimeout(timer)
    }

    if (pathChanged || hashChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [pathname, hash])

  return null
}
