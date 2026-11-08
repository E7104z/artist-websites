import { useArtist } from '../ArtistContext'
import { BookingInquiryForm } from '../components/BookingInquiryForm'

export function BookingCTA() {
  const { booking, name } = useArtist()
  const first = name.split(" ")[0]
  return (
    <section className="booking" id="booking" aria-labelledby="booking-title">
      <div className="wrap booking-grid">
        <div>
          <p className="label">04 &nbsp;/&nbsp; Work with {first}</p>
          <h2 id="booking-title">{booking.heading}</h2>
          <p>{booking.intro}</p>
        </div>
        <BookingInquiryForm />
      </div>
    </section>
  )
}
