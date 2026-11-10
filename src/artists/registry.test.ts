import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ARTISTS, resolveArtist } from './registry'
import type { ArtistSite } from '@/core/types'

const other = { ...ARTISTS[0], slug: 'other-artist', hostnames: ['other.example.com'], name: 'Other' } as ArtistSite

describe('resolveArtist', () => {
  const list = [...ARTISTS, other]
  it('prefers the build-time slug', () => {
    expect(resolveArtist('tracy.example.com', 'other-artist', list).slug).toBe('other-artist')
  })
  it('falls back to the hostname, ignoring www', () => {
    expect(resolveArtist('www.other.example.com', undefined, list).slug).toBe('other-artist')
  })
  it('falls back to the default artist for unknown hosts and slugs', () => {
    expect(resolveArtist('unknown.example.com', 'nope', list).slug).toBe('tracy-smith')
  })
})

describe('artist configs', () => {
  it('have unique slugs and complete image focal points', () => {
    const slugs = ARTISTS.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const a of ARTISTS) {
      for (const f of [a.hero.image.focal.mobile, a.hero.image.focal.desktop]) {
        expect(f.x).toBeGreaterThanOrEqual(0); expect(f.x).toBeLessThanOrEqual(100)
        expect(f.y).toBeGreaterThanOrEqual(0); expect(f.y).toBeLessThanOrEqual(100)
      }
    }
  })

  it('reference media files that exist in public/', () => {
    const pub = (url: string) => path.resolve(__dirname, '../../public', url.replace(/^\//, ''))
    for (const a of ARTISTS) {
      const images = [a.hero.image, ...a.performances.items.map((v) => v.poster), ...(a.gallery?.items ?? [])]
      for (const img of images) {
        for (const w of img.widths) {
          for (const ext of ['avif', 'webp']) expect(existsSync(pub(`${img.base}-${w}.${ext}`)), `${img.base}-${w}.${ext}`).toBe(true)
        }
      }
      for (const v of a.performances.items) if (v.src) expect(existsSync(pub(v.src)), v.src).toBe(true)
    }
  })
})
