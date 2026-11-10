import type { CSSProperties } from 'react'
import { useArtist } from '../ArtistContext'
import { Picture } from '../components/Picture'
import { sectionNumber } from '../lib/sectionNumber'
import type { GalleryPhoto } from '../types'

/** Desktop shows rows of this many photos; each row is justified to equal height. */
const PER_ROW = 3

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size))
  return rows
}

const ratio = (photo: GalleryPhoto) => photo.width / photo.height

export function Gallery({ num }: { num: number }) {
  const { gallery } = useArtist()
  if (!gallery?.items.length) return null
  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <p className="label">{sectionNumber(num)} &nbsp;/&nbsp; Gallery</p>
        <h2 id="gallery-title">{gallery.heading}</h2>
        <div className="gallery-grid">
          {chunk(gallery.items, PER_ROW).map((row, i) => (
            <ul
              key={i}
              className="gallery-row"
              style={{ '--sum': row.reduce((total, photo) => total + ratio(photo), 0), '--n': row.length } as CSSProperties}
            >
              {row.map((photo) => (
                <li
                  key={photo.base}
                  className={`gallery-item${photo.cutout ? ' cutout' : ''}`}
                  style={{ aspectRatio: `${photo.width} / ${photo.height}`, flexGrow: ratio(photo) }}
                >
                  <Picture image={photo} sizes="(min-width: 900px) 34vw, (min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
