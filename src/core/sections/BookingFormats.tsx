import { useArtist } from '../ArtistContext'
import { sectionNumber } from '../lib/sectionNumber'

export function BookingFormats({ num }: { num: number }) {
  const { experience } = useArtist()
  return (
    <section className="experience" id="experience" aria-labelledby="experience-title">
      <div className="wrap experience-grid">
        <div>
          <p className="label">{sectionNumber(num)} &nbsp;/&nbsp; The Experience</p>
          <h2 id="experience-title">
            {experience.heading[0]}
            <br />
            {experience.heading[1]}
          </h2>
          <p className="experience-intro">{experience.intro}</p>
        </div>
        <ol className="formats">
          {experience.items.map((item, index) => (
            <li className="format" key={item.id}>
              <span className="format-num">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
