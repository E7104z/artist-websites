import { Link } from 'react-router-dom'
import { useArtist } from '../ArtistContext'

export function SiteFooter() {
  const artist = useArtist()
  const { contact } = artist
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-row">
          <div className="footer-name">{artist.name}.</div>
          <nav className="footer-links" aria-label="Footer">
            <Link to="/#about">About</Link>
            <Link to="/#performances">Performances</Link>
            <Link to="/#experience">The Experience</Link>
            <Link to="/#booking">Book {artist.name.split(' ')[0]}</Link>
          </nav>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {artist.name}. All rights reserved.</span>
          <span className="foot-meta">
            {contact.social.map((s) => (
              <a key={s.url} href={s.url} rel="noopener noreferrer" target="_blank">{s.label}</a>
            ))}
            {contact.managementEmail ? <a href={`mailto:${contact.managementEmail}`}>Management</a> : null}
            <Link to="/privacy">Privacy</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
