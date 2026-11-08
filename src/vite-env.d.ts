/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ARTIST_SLUG?: string
  readonly VITE_BOOKING_ENDPOINT?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
