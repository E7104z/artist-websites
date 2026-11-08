import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to #anchors on navigation (router links to /#booking etc.) and to the top otherwise. */
export function useHashScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}
