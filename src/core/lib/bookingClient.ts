import type { BookingInquiryPayload } from './contract'

export type SubmitResult =
  | { ok: true; reference: string; duplicate: boolean }
  | { ok: false; kind: 'validation'; fields: Record<string, string> }
  | { ok: false; kind: 'rate_limited' }
  | { ok: false; kind: 'failed' }

interface ApiSuccess {
  ok: true
  reference?: string
  duplicate?: boolean
}
interface ApiFailure {
  ok: false
  error?: string
  issues?: { path: string; message: string }[]
}

export function bookingEndpoint(): string | undefined {
  const value = import.meta.env.VITE_BOOKING_ENDPOINT as string | undefined
  return value && value.trim() ? value.trim() : undefined
}

/**
 * Posts an inquiry to AgencyOS. "Success" means the server confirmed the
 * inquiry was persisted AND returned a reference. Anything else — network
 * error, timeout, non-2xx, missing reference — is a failure, so the visitor is
 * never told "received" for something that wasn't stored. Re-sending the same
 * inquiry is safe: the server de-duplicates.
 */
export async function submitInquiry(
  payload: BookingInquiryPayload,
  options: { endpoint?: string; timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<SubmitResult> {
  const endpoint = options.endpoint ?? bookingEndpoint()
  if (!endpoint) {
    console.error('VITE_BOOKING_ENDPOINT is not configured')
    return { ok: false, kind: 'failed' }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000)
  try {
    const response = await (options.fetchImpl ?? fetch)(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    const body = (await response.json().catch(() => null)) as ApiSuccess | ApiFailure | null

    if (response.ok && body && body.ok === true && typeof body.reference === 'string' && body.reference) {
      return { ok: true, reference: body.reference, duplicate: Boolean(body.duplicate) }
    }
    if (response.status === 400 && body && body.ok === false && body.issues) {
      const fields: Record<string, string> = {}
      for (const issue of body.issues) fields[issue.path] = issue.message
      return { ok: false, kind: 'validation', fields }
    }
    if (response.status === 429) return { ok: false, kind: 'rate_limited' }
    return { ok: false, kind: 'failed' }
  } catch {
    return { ok: false, kind: 'failed' }
  } finally {
    clearTimeout(timer)
  }
}
