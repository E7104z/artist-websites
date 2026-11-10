import { useArtist } from '../ArtistContext'
import { sectionNumber } from '../lib/sectionNumber'

/** Renders **double-asterisk** phrases as <strong>; everything else stays plain text. */
function withEmphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
}

export function ArtistStory({ num }: { num: number }) {
  const { about } = useArtist()
  return (
    <section className="intro" id="about" aria-labelledby="about-title">
      <div className="wrap intro-grid">
        <div>
          <p className="label">{sectionNumber(num)} &nbsp;/&nbsp; The Artist</p>
          <h2 id="about-title">
            {about.heading[0]}
            <br />
            <em>{about.heading[1]}</em>
          </h2>
          {about.tagline && <p className="intro-tagline">{about.tagline}</p>}
        </div>
        <div>
          {about.paragraphs.map((p) => (
            <p key={p}>{withEmphasis(p)}</p>
          ))}
          {about.closing && <p className="intro-closing">{about.closing}</p>}
          <ul className="meta">
            {about.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
