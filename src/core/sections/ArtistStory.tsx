import { useArtist } from '../ArtistContext'

export function ArtistStory() {
  const { about } = useArtist()
  return (
    <section className="intro" id="about" aria-labelledby="about-title">
      <div className="wrap intro-grid">
        <div>
          <p className="label">01 &nbsp;/&nbsp; The Artist</p>
          <h2 id="about-title">
            {about.heading[0]}
            <br />
            <em>{about.heading[1]}</em>
          </h2>
        </div>
        <div>
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
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
