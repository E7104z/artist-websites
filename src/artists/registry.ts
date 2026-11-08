import type { ArtistSite } from '@/core/types'
import { tracySmith } from './tracy-smith/config'

/** Every artist this codebase can serve. Add new artists here. */
export const ARTISTS: ArtistSite[] = [tracySmith]

export const DEFAULT_ARTIST_SLUG = 'tracy-smith'

/**
 * Resolution order:
 *  1. VITE_ARTIST_SLUG (build-time; the recommended setup, one deployment per artist)
 *  2. the hostname, for custom domains and aliases mapped in a config
 *  3. the default artist
 */
export function resolveArtist(
  hostname: string,
  configuredSlug: string | undefined = import.meta.env.VITE_ARTIST_SLUG,
  artists: ArtistSite[] = ARTISTS,
): ArtistSite {
  const bySlug = configuredSlug ? artists.find((a) => a.slug === configuredSlug) : undefined
  if (bySlug) return bySlug
  const byHost = artists.find((a) => a.hostnames.includes(hostname.toLowerCase().replace(/^www\./, '')))
  if (byHost) return byHost
  return artists.find((a) => a.slug === DEFAULT_ARTIST_SLUG) ?? artists[0]
}
