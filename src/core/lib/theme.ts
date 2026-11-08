import type { ArtistSite } from '../types'

/** Applies an artist's palette as CSS custom properties. */
export function applyTheme(artist: ArtistSite, root: HTMLElement = document.documentElement) {
  const { colors } = artist.theme
  root.style.setProperty('--stage', colors.stage)
  root.style.setProperty('--ivory', colors.ivory)
  root.style.setProperty('--copper', colors.copper)
  root.style.setProperty('--walnut', colors.walnut)
  root.style.setProperty('--sand', colors.sand)
  root.style.setProperty('--night', colors.night)
}
