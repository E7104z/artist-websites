import { useArtist } from '../ArtistContext'
import { Picture } from '../components/Picture'
import { sectionNumber } from '../lib/sectionNumber'

export function Gallery({ num }: { num: number }) {
  const { gallery } = useArtist()
  if (!gallery?.items.length) return null
  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="wrap">
        <p className="label">{sectionNumber(num)} &nbsp;/&nbsp; Gallery</p>
        <h2 id="gallery-title">{gallery.heading}</h2>
        <ul className="gallery-grid">
          {gallery.items.map((photo) => (
            <li key={photo.base} className={`gallery-item${photo.cutout ? ' cutout' : ''}`}>
              <Picture image={photo} sizes="(min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
