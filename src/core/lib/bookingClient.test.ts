import { describe, expect, it, vi } from 'vitest'
import { submitInquiry } from './bookingClient'
import { EMPTY_FORM, toPayload, validateForm } from './contract'

const payload = toPayload('tracy-smith', {
  ...EMPTY_FORM, name: 'Sample Booker', email: 'b@example.com', eventType: 'corporate', date: '2099-01-01',
  city: 'St. Louis', state: 'MO', consentToContact: true,
})

const respond = (status: number, body: unknown) =>
  vi.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body }) as unknown as typeof fetch

describe('submitInquiry', () => {
  it('succeeds only when the server confirms with a reference', async () => {
    const result = await submitInquiry(payload, { endpoint: 'https://x', fetchImpl: respond(201, { ok: true, reference: 'INQ-1234ABCD', duplicate: false }) })
    expect(result).toEqual({ ok: true, reference: 'INQ-1234ABCD', duplicate: false })
  })

  it('treats ok:true without a reference (e.g. a honeypot response) as a failure', async () => {
    const result = await submitInquiry(payload, { endpoint: 'https://x', fetchImpl: respond(200, { ok: true }) })
    expect(result).toEqual({ ok: false, kind: 'failed' })
  })

  it('maps validation, rate-limit and server errors', async () => {
    const v = await submitInquiry(payload, { endpoint: 'https://x', fetchImpl: respond(400, { ok: false, issues: [{ path: 'contact.email', message: 'Invalid email' }] }) })
    expect(v).toEqual({ ok: false, kind: 'validation', fields: { 'contact.email': 'Invalid email' } })
    expect(await submitInquiry(payload, { endpoint: 'https://x', fetchImpl: respond(429, { ok: false }) })).toEqual({ ok: false, kind: 'rate_limited' })
    expect(await submitInquiry(payload, { endpoint: 'https://x', fetchImpl: respond(500, { ok: false }) })).toEqual({ ok: false, kind: 'failed' })
    expect(await submitInquiry(payload, { endpoint: 'https://x', fetchImpl: respond(503, { ok: false }) })).toEqual({ ok: false, kind: 'failed' })
  })

  it('fails on network errors and when no endpoint is configured', async () => {
    const boom = vi.fn().mockRejectedValue(new TypeError('offline')) as unknown as typeof fetch
    expect(await submitInquiry(payload, { endpoint: 'https://x', fetchImpl: boom })).toEqual({ ok: false, kind: 'failed' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await submitInquiry(payload, { endpoint: undefined, fetchImpl: boom })).toEqual({ ok: false, kind: 'failed' })
  })
})

describe('payload and validation', () => {
  it('never sends agency, artist id, stage or source', () => {
    const keys = Object.keys(payload)
    for (const forbidden of ['agencyId', 'artistId', 'stage', 'source']) expect(keys).not.toContain(forbidden)
    expect(payload.artistSlug).toBe('tracy-smith')
    expect(payload.website).toBe('')
  })

  it('omits the date when it is to be determined and keeps marketing consent separate', () => {
    const p = toPayload('tracy-smith', { ...EMPTY_FORM, dateStatus: 'tbd', date: '2099-01-01', consentToContact: true })
    expect(p.event.date).toBeUndefined()
    expect(p.marketingConsent).toBe(false)
  })

  it('requires only the essentials', () => {
    const errors = validateForm(EMPTY_FORM)
    expect(Object.keys(errors).sort()).toEqual(['consentToContact', 'date', 'email', 'eventType', 'name', 'state', 'city'].sort())
    expect(validateForm({ ...EMPTY_FORM, dateStatus: 'tbd' }).date).toBeUndefined()
  })
})
