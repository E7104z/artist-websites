/**
 * An artist website is described entirely by data. Adding an artist means
 * adding a folder under src/artists/<slug>/ with a config of this shape plus
 * its images; no component changes are needed.
 */

export interface Focal {
  /** 0–100, percent from the left / top of the source image. */
  x: number
  y: number
}

export interface ImageSet {
  /** Path prefix without size/extension, e.g. /artists/tracy-smith/hero-portrait */
  base: string
  /** Available pixel widths of the generated variants. */
  widths: number[]
  /** Intrinsic size of the largest variant (prevents layout shift). */
  width: number
  height: number
  alt: string
  /** Where the subject is, so crops keep the face in frame. */
  focal: { mobile: Focal; desktop: Focal }
}

export interface ThemeColors {
  stage: string
  ivory: string
  copper: string
  walnut: string
  sand: string
  night: string
}

export interface PerformanceVideo {
  id: string
  /** YouTube video ID (played through youtube-nocookie.com after an explicit click). */
  youtubeId?: string
  /** Self-hosted MP4 (used when there is no youtubeId). Never preloaded. */
  src?: string
  kicker: string
  title: string
  poster: ImageSet
}

export interface GalleryPhoto extends ImageSet {
  /** Transparent cut-out (e.g. studio portrait); shown on a sand backdrop instead of cropped edge to edge. */
  cutout?: boolean
}

export interface Choice {
  value: string
  label: string
}

export interface ArtistSite {
  slug: string
  /** Hostnames that should resolve to this artist (custom domains, previews). */
  hostnames: string[]
  name: string
  descriptor: string
  location: string
  genres: string[]
  theme: { colors: ThemeColors }
  hero: {
    eyebrow: string
    headline: [string, string]
    intro: string
    image: ImageSet
  }
  about: {
    heading: [string, string]
    paragraphs: string[]
    facts: string[]
  }
  performances: {
    heading: string
    items: PerformanceVideo[]
  }
  /** Optional photo gallery. Omit to hide the section and its nav link. */
  gallery?: {
    heading: string
    items: GalleryPhoto[]
  }
  experience: {
    heading: [string, string]
    intro: string
    items: { id: string; title: string; description: string }[]
  }
  booking: {
    heading: string
    intro: string
    note: string
    eventTypes: Choice[]
    formats: Choice[]
    budgetBands: Choice[]
  }
  contact: {
    /** Shown as a fallback when a submission fails. Only set when verified. */
    managementEmail?: string
    social: { label: string; url: string }[]
  }
}
