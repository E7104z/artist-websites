import { Link } from 'react-router-dom'
import { useArtist } from '../ArtistContext'
import { track } from '../lib/analytics'

export function SiteNav() {
  const artist = useArtist()
  return (
    <header className="nav">
      <nav className="nav-inner wrap" aria-label="Main">
        <Link to="/" className="brand">{artist.name}</Link>
        <div className="menu">
          <Link className="menu-link" to="/#about">About</Link>
          <Link className="menu-link" to="/#performances">Performances</Link>
          <Link className="menu-link" to="/#experience">The Experience</Link>
          <Link className="nav-cta" to="/#booking" onClick={() => track('cta_book_click', { place: 'nav' })}>
            Book {artist.name.split(' ')[0]}
          </Link>
        </div>
      </nav>
    </header>
  )
}
