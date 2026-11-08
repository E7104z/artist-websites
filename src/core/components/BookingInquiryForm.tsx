import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useArtist } from '../ArtistContext'
import { submitInquiry } from '../lib/bookingClient'
import { track } from '../lib/analytics'
import {
  EMPTY_FORM,
  toPayload,
  validateForm,
  type BookingFormValues,
  type FieldErrors,
} from '../lib/contract'
import { TurnstileWidget } from './TurnstileWidget'

type Status = 'idle' | 'submitting' | 'failed' | 'rate_limited' | 'verify'

const SERVER_FIELD_MAP: Record<string, keyof BookingFormValues> = {
  'contact.name': 'name',
  'contact.email': 'email',
  'contact.phone': 'phone',
  'contact.organization': 'organization',
  'event.type': 'eventType',
  'event.dateStatus': 'dateStatus',
  'event.date': 'date',
  'event.city': 'city',
  'event.state': 'state',
  'event.venue': 'venue',
  'event.format': 'format',
  'event.estimatedGuests': 'estimatedGuests',
  'event.budgetBand': 'budgetBand',
  'event.notes': 'notes',
  consentToContact: 'consentToContact',
}

const FIELD_ORDER: (keyof BookingFormValues)[] = [
  'name', 'email', 'eventType', 'date', 'city', 'state', 'estimatedGuests', 'notes', 'consentToContact',
]

function Field({
  id, label, error, required, children,
}: { id: string; label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function BookingInquiryForm() {
  const artist = useArtist()
  const navigate = useNavigate()
  const { booking, contact } = artist
  const formRef = useRef<HTMLFormElement>(null)
  const started = useRef(false)

  const [values, setValues] = useState<BookingFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [token, setToken] = useState<string>()
  const [resetSignal, setResetSignal] = useState(0)

  const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim()

  const set =
    (name: keyof BookingFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (!started.current) {
        started.current = true
        track('form_start')
      }
      const target = event.target
      const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
      setValues((prev) => ({ ...prev, [name]: value }))
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

  const focusFirstError = (found: FieldErrors) => {
    const first = FIELD_ORDER.find((key) => found[key])
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'submitting') return

    const found = validateForm(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setStatus('idle')
      focusFirstError(found)
      return
    }
    if (siteKey && !token) {
      setErrors({})
      setStatus('verify')
      return
    }

    setErrors({})
    setStatus('submitting')
    const result = await submitInquiry(toPayload(artist.slug, values, token))

    if (result.ok) {
      track('form_submit_success')
      navigate('/thanks', { state: { reference: result.reference, name: values.name.trim() } })
      return
    }

    // A Turnstile token is single use; always request a fresh one after a failure.
    setResetSignal((n) => n + 1)

    if (result.kind === 'validation') {
      const mapped: FieldErrors = {}
      for (const [path, message] of Object.entries(result.fields)) {
        const key = SERVER_FIELD_MAP[path]
        if (key) mapped[key] = message
      }
      if (Object.keys(mapped).length > 0) {
        setErrors(mapped)
        setStatus('idle')
        focusFirstError(mapped)
        return
      }
    }
    setStatus(result.kind === 'rate_limited' ? 'rate_limited' : 'failed')
  }

  const showDate = values.dateStatus !== 'tbd'

  return (
    <form ref={formRef} className="booking-form" onSubmit={handleSubmit} noValidate aria-describedby="form-status">
      <Field id="name" label="Your name" required error={errors.name}>
        <input id="name" name="name" autoComplete="name" value={values.name} onChange={set('name')}
          aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
      </Field>
      <Field id="email" label="Email address" required error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email}
          onChange={set('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
      </Field>
      <Field id="eventType" label="Event type" required error={errors.eventType}>
        <select id="eventType" name="eventType" value={values.eventType} onChange={set('eventType')}
          aria-invalid={Boolean(errors.eventType)} aria-describedby={errors.eventType ? 'eventType-error' : undefined}>
          <option value="">Select event type</option>
          {booking.eventTypes.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>

      <fieldset className="field full date-choice">
        <legend>Event date</legend>
        <div className="radio-row">
          {[
            ['fixed', 'I have a date'],
            ['flexible', 'My date is flexible'],
            ['tbd', 'Date to be determined'],
          ].map(([value, label]) => (
            <label key={value} className="radio">
              <input type="radio" name="dateStatus" value={value} checked={values.dateStatus === value}
                onChange={set('dateStatus')} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {showDate ? (
          <>
            <label htmlFor="date" className="sr-only">
              {values.dateStatus === 'flexible' ? 'Target date (optional)' : 'Event date'}
            </label>
            <input id="date" name="date" type="date" value={values.date} onChange={set('date')}
              aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'date-error' : undefined} />
            {errors.date ? <p className="field-error" id="date-error">{errors.date}</p> : null}
          </>
        ) : null}
      </fieldset>

      <Field id="city" label="Event city" required error={errors.city}>
        <input id="city" name="city" autoComplete="address-level2" value={values.city} onChange={set('city')}
          aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? 'city-error' : undefined} />
      </Field>
      <Field id="state" label="State" required error={errors.state}>
        <input id="state" name="state" autoComplete="address-level1" value={values.state} onChange={set('state')}
          aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? 'state-error' : undefined} />
      </Field>

      <details className="full more-details">
        <summary>More details (optional)</summary>
        <div className="more-grid">
          <Field id="venue" label="Venue name">
            <input id="venue" name="venue" value={values.venue} onChange={set('venue')} />
          </Field>
          <Field id="organization" label="Organization">
            <input id="organization" name="organization" autoComplete="organization" value={values.organization}
              onChange={set('organization')} />
          </Field>
          <Field id="phone" label="Phone number">
            <input id="phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} />
          </Field>
          <Field id="format" label="Preferred format">
            <select id="format" name="format" value={values.format} onChange={set('format')}>
              <option value="">Not sure yet</option>
              {booking.formats.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field id="estimatedGuests" label="Estimated guests" error={errors.estimatedGuests}>
            <input id="estimatedGuests" name="estimatedGuests" inputMode="numeric" value={values.estimatedGuests}
              onChange={set('estimatedGuests')} aria-invalid={Boolean(errors.estimatedGuests)}
              aria-describedby={errors.estimatedGuests ? 'estimatedGuests-error' : undefined} />
          </Field>
          <Field id="budgetBand" label="Budget range">
            <select id="budgetBand" name="budgetBand" value={values.budgetBand} onChange={set('budgetBand')}>
              <option value="">Prefer not to say</option>
              {booking.budgetBands.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </div>
      </details>

      <div className="field full">
        <label htmlFor="notes">Tell us about the event</label>
        <textarea id="notes" name="notes" rows={4} maxLength={2000} value={values.notes} onChange={set('notes')}
          placeholder="Audience size, schedule, the feeling you’re after, anything else helpful"
          aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? 'notes-error' : undefined} />
        {errors.notes ? <p className="field-error" id="notes-error">{errors.notes}</p> : null}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. Must stay empty. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website}
          onChange={set('website')} />
      </div>

      <div className="field full consents">
        <label className="check">
          <input type="checkbox" name="consentToContact" checked={values.consentToContact}
            onChange={set('consentToContact')} aria-invalid={Boolean(errors.consentToContact)}
            aria-describedby={errors.consentToContact ? 'consent-error' : undefined} />
          <span>
            I agree that Tracy’s booking team may contact me about this inquiry.{' '}
            <Link to="/privacy">Privacy notice</Link> <span aria-hidden="true">*</span>
          </span>
        </label>
        {errors.consentToContact ? <p className="field-error" id="consent-error">{errors.consentToContact}</p> : null}
        <label className="check">
          <input type="checkbox" name="marketingConsent" checked={values.marketingConsent}
            onChange={set('marketingConsent')} />
          <span>Optional: send me occasional news about Tracy’s performances.</span>
        </label>
      </div>

      {siteKey ? (
        <div className="field full">
          <TurnstileWidget siteKey={siteKey} onToken={setToken} resetSignal={resetSignal} />
        </div>
      ) : null}

      <div className="full form-actions">
        <button className="button dark" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send booking inquiry'}
        </button>
        <p className="form-note">{booking.note}</p>
      </div>

      <div id="form-status" className="full" role="status" aria-live="polite">
        {status === 'failed' ? (
          <p className="form-error">
            We couldn’t submit your request. Please try again.
            {contact.managementEmail ? (
              <> You can also email <a href={`mailto:${contact.managementEmail}`}>{contact.managementEmail}</a>.</>
            ) : null}
          </p>
        ) : null}
        {status === 'verify' ? (
          <p className="form-error">Please complete the verification check before sending.</p>
        ) : null}
        {status === 'rate_limited' ? (
          <p className="form-error">Too many requests right now. Please wait a little while and try again.</p>
        ) : null}
      </div>
    </form>
  )
}
