import { z } from 'zod'

/**
 * Client copy of the AgencyOS public booking-inquiry contract (v1). The server
 * re-validates everything; keep this in sync with
 * artist-app/functions/src/bookingInquiry/schema.ts.
 */
export const EVENT_TYPES = ['corporate', 'wedding-private', 'concert-venue', 'church', 'other'] as const
export const PERFORMANCE_FORMATS = ['solo', 'pianist', 'full-band'] as const
export const DATE_STATUSES = ['fixed', 'flexible', 'tbd'] as const
export const BUDGET_BANDS = ['under-1500', '1500-3000', '3000-6000', '6000-plus'] as const

export interface BookingInquiryPayload {
  artistSlug: string
  contact: { name: string; email: string; phone?: string; organization?: string }
  event: {
    type: (typeof EVENT_TYPES)[number]
    dateStatus: (typeof DATE_STATUSES)[number]
    date?: string
    city: string
    state: string
    venue?: string
    format?: (typeof PERFORMANCE_FORMATS)[number]
    estimatedGuests?: number
    budgetBand?: (typeof BUDGET_BANDS)[number]
    notes?: string
  }
  consentToContact: true
  marketingConsent: boolean
  /** Honeypot: must stay empty. */
  website: string
  turnstileToken?: string
}

export interface BookingFormValues {
  name: string
  email: string
  phone: string
  organization: string
  eventType: string
  dateStatus: string
  date: string
  city: string
  state: string
  venue: string
  format: string
  estimatedGuests: string
  budgetBand: string
  notes: string
  consentToContact: boolean
  marketingConsent: boolean
  website: string
}

export const EMPTY_FORM: BookingFormValues = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  eventType: '',
  dateStatus: 'fixed',
  date: '',
  city: '',
  state: '',
  venue: '',
  format: '',
  estimatedGuests: '',
  budgetBand: '',
  notes: '',
  consentToContact: false,
  marketingConsent: false,
  website: '',
}

export type FieldErrors = Partial<Record<keyof BookingFormValues, string>>

const emailSchema = z.string().email()

const todayIso = () => new Date().toISOString().slice(0, 10)

export function validateForm(values: BookingFormValues): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!emailSchema.safeParse(values.email.trim()).success) errors.email = 'That email address doesn’t look right.'
  if (!values.eventType) errors.eventType = 'Please choose an event type.'
  if (values.dateStatus === 'fixed') {
    if (!values.date) errors.date = 'Please choose a date, or select “date to be determined”.'
    else if (values.date < todayIso()) errors.date = 'That date is in the past.'
  }
  if (values.dateStatus === 'flexible' && values.date && values.date < todayIso()) {
    errors.date = 'That date is in the past.'
  }
  if (!values.city.trim()) errors.city = 'Please enter the event city.'
  if (!values.state.trim()) errors.state = 'Please enter the state.'
  if (values.estimatedGuests && !/^\d+$/.test(values.estimatedGuests.trim())) {
    errors.estimatedGuests = 'Use a whole number.'
  }
  if (values.notes.length > 2000) errors.notes = 'Please keep this under 2,000 characters.'
  if (!values.consentToContact) {
    errors.consentToContact = 'Please confirm we may contact you about this inquiry.'
  }
  return errors
}

const opt = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

/** Builds the exact wire payload. Never includes agency, artist ID, stage or source. */
export function toPayload(
  artistSlug: string,
  values: BookingFormValues,
  turnstileToken?: string,
): BookingInquiryPayload {
  const guests = values.estimatedGuests.trim()
  return {
    artistSlug,
    contact: {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: opt(values.phone),
      organization: opt(values.organization),
    },
    event: {
      type: values.eventType as BookingInquiryPayload['event']['type'],
      dateStatus: values.dateStatus as BookingInquiryPayload['event']['dateStatus'],
      date: values.dateStatus === 'tbd' ? undefined : opt(values.date),
      city: values.city.trim(),
      state: values.state.trim(),
      venue: opt(values.venue),
      format: (opt(values.format) as BookingInquiryPayload['event']['format']) ?? undefined,
      estimatedGuests: guests ? Number(guests) : undefined,
      budgetBand: (opt(values.budgetBand) as BookingInquiryPayload['event']['budgetBand']) ?? undefined,
      notes: opt(values.notes),
    },
    consentToContact: true,
    marketingConsent: values.marketingConsent,
    website: values.website,
    turnstileToken,
  }
}
