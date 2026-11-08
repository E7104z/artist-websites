import { useEffect } from 'react'
import { useArtist } from '../ArtistContext'

/** Sets a per-page title; restores the baked-in SEO title on leave. */
export function usePageTitle(title: string) {
  const { name } = useArtist()
  useEffect(() => {
    const previous = document.title
    document.title = `${title} | ${name}`
    return () => {
      document.title = previous
    }
  }, [title, name])
}
