import { Link } from 'react-router-dom'
import { useArtist } from '../ArtistContext'
import { VideoCard } from '../components/VideoCard'
import { track } from '../lib/analytics'

export function Performances() {
  const { performances, name } = useArtist()
  const first = name.split(' ')[0]
  return (
    <section className="media" id="performances" aria-labelledby="performances-title">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="label">02 &nbsp;/&nbsp; In Performance</p>
            <h2 id="performances-title">{performances.heading}</h2>
          </div>
          <Link className="text-link" to="/#booking" onClick={() => track('cta_book_click', { place: 'performances' })}>
            Book {first} for your event
          </Link>
        </div>
        <div className="media-grid">
          {performances.items.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              large={index === 0}
              sizes={index === 0 ? '(min-width: 900px) 58vw, 100vw' : '(min-width: 900px) 32vw, 100vw'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
