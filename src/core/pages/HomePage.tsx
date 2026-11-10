import { useArtist } from '../ArtistContext'
import { ArtistStory } from '../sections/ArtistStory'
import { BookingCTA } from '../sections/BookingCTA'
import { BookingFormats } from '../sections/BookingFormats'
import { Gallery } from '../sections/Gallery'
import { Hero } from '../sections/Hero'
import { Performances } from '../sections/Performances'

export function HomePage() {
  const { gallery } = useArtist()
  const sections = [ArtistStory, Performances, ...(gallery?.items.length ? [Gallery] : []), BookingFormats, BookingCTA]
  return (
    <>
      <Hero />
      {sections.map((Section, i) => (
        <Section key={i} num={i + 1} />
      ))}
    </>
  )
}
