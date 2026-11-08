import { useArtist } from '../ArtistContext'
import { BookingInquiryForm } from '../components/BookingInquiryForm'
import { usePageTitle } from '../lib/usePageTitle'

/** Focused booking page for deep links and campaigns. Same form as the homepage section. */
export function BookingPage() {
  const { booking, name } = useArtist()
  usePageTitle(`Book ${name}`)
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="label">Work with {name.split(' ')[0]}</p>
          <h1>{booking.heading}</h1>
          <p>{booking.intro}</p>
        </div>
      </section>
      <section className="booking page-body">
        <div className="wrap booking-solo">
          <BookingInquiryForm />
        </div>
      </section>
    </>
  )
}
