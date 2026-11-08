/**
 * Privacy-conscious event tracking: names only, never form values or any PII.
 * Wire to a cookieless analytics tool (e.g. Plausible) by defining
 * `window.plausible`; with none present this does nothing.
 */
export type SiteEvent = 'cta_book_click' | 'video_play' | 'form_start' | 'form_submit_success'

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export function track(event: SiteEvent, props?: Record<string, string>) {
  try {
    window.plausible?.(event, props ? { props } : undefined)
  } catch {
    /* analytics must never break the site */
  }
}
