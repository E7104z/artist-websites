import { Link } from 'react-router-dom'
import { useArtist } from '../ArtistContext'
import { Picture } from '../components/Picture'
import { track } from '../lib/analytics'

export function Hero() {
  const { hero, genres, name } = useArtist()
  const first = name.split(' ')[0]
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-visual">
        <Picture image={hero.image} sizes="(min-width: 900px) 45vw, 100vw" priority className="hero-image" />
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title">
            {hero.headline[0]} <i>{hero.headline[1]}</i>
          </h1>
          <p className="hero-intro">{hero.intro}</p>
          <div className="cta-row">
            <Link to="/#booking" className="button" onClick={() => track('cta_book_click', { place: 'hero' })}>
              Book {first} <span aria-hidden="true">&nbsp;↗</span>
            </Link>
            <Link to="/#performances" className="text-link">Watch Performances</Link>
          </div>
        </div>
      </div>
      <p className="hero-side" aria-label="Genres">
        {genres.slice(0, 4).join('  /  ')}
      </p>
    </section>
  )
}
