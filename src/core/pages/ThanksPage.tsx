import { Link, useLocation } from 'react-router-dom'
import { useArtist } from '../ArtistContext'
import { usePageTitle } from '../lib/usePageTitle'

interface ThanksState {
  reference?: string
  name?: string
}

/**
 * Only reachable with a server-issued reference passed from the form after the
 * API confirmed the inquiry was stored. Visiting /thanks directly never claims
 * that anything was submitted.
 */
export function ThanksPage() {
  const { state } = useLocation() as { state: ThanksState | null }
  const { name } = useArtist()
  usePageTitle('Inquiry received')
  const reference = state?.reference

  return (
    <section className="page-head thanks">
      <div className="wrap">
        {reference ? (
          <>
            <p className="label">Inquiry received</p>
            <h1>Thank you{state?.name ? `, ${state.name.split(' ')[0]}` : ''}.</h1>
            <p>
              Thank you. Your inquiry has been received. {name.split(' ')[0]}’s booking team will review the details
              and follow up.
            </p>
            <p className="reference">
              Your reference: <strong>{reference}</strong>
            </p>
            <p className="fine-note">
              This is a request, not a reservation. Availability and details are confirmed by the booking team.
            </p>
          </>
        ) : (
          <>
            <p className="label">Booking</p>
            <h1>No inquiry to show.</h1>
            <p>If you’d like to book {name}, you can send an inquiry from the booking form.</p>
            <Link className="button" to="/#booking">Go to the booking form</Link>
          </>
        )}
        <p>
          <Link className="text-link" to="/">Back to the homepage</Link>
        </p>
      </div>
    </section>
  )
}
