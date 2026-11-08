import { useArtist } from '../ArtistContext'
import { usePageTitle } from '../lib/usePageTitle'

/** DRAFT notice describing what this site actually does. Review before publication. */
export function PrivacyPage() {
  const { name } = useArtist()
  usePageTitle('Privacy notice')
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="label">Privacy</p>
          <h1>Privacy notice</h1>
        </div>
      </section>
      <section className="booking page-body prose">
        <div className="wrap">
          <h2>What we collect</h2>
          <p>
            When you send a booking inquiry on this site we collect the details you enter: your name, email address,
            and the event information you provide. Phone number, organization, venue, guest count, budget range and
            notes are optional. We also use your network address briefly to limit abuse; it is stored only in a
            one-way hashed form.
          </p>
          <h2>How we use it</h2>
          <p>
            We use your inquiry to review your request and reply to you on behalf of {name}. Your inquiry is stored in
            the booking system used by {name}’s management team. Sending an inquiry does not reserve a date.
          </p>
          <h2>Promotional messages</h2>
          <p>
            Permission to contact you about your inquiry is separate from permission to send promotional news. We send
            news only if you tick the optional box.
          </p>
          <h2>Third parties</h2>
          <p>
            Our spam check (Cloudflare Turnstile) runs on the booking form. Performance videos are YouTube videos that
            load only after you press play, using YouTube’s privacy-enhanced mode.
          </p>
          <h2>Your choices</h2>
          <p>
            You can ask the booking team to correct or delete your inquiry or to stop contacting you by replying to
            any message from them.
          </p>
        </div>
      </section>
    </>
  )
}
