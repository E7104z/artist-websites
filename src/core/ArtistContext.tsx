import { createContext, useContext, type ReactNode } from 'react'
import type { ArtistSite } from './types'

const ArtistContext = createContext<ArtistSite | null>(null)

export function ArtistProvider({ artist, children }: { artist: ArtistSite; children: ReactNode }) {
  return <ArtistContext.Provider value={artist}>{children}</ArtistContext.Provider>
}

export function useArtist(): ArtistSite {
  const artist = useContext(ArtistContext)
  if (!artist) throw new Error('useArtist must be used inside <ArtistProvider>')
  return artist
}
