import { ArtistStory } from '../sections/ArtistStory'
import { BookingCTA } from '../sections/BookingCTA'
import { BookingFormats } from '../sections/BookingFormats'
import { Hero } from '../sections/Hero'
import { Performances } from '../sections/Performances'

export function HomePage() {
  return (
    <>
      <Hero />
      <ArtistStory />
      <Performances />
      <BookingFormats />
      <BookingCTA />
    </>
  )
}
