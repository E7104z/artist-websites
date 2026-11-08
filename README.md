# artist-websites

Reusable, config-driven public sites for represented artists. One codebase, one folder per artist. First site: **Tracy Smith** (premium, versatile live vocalist).

Booking inquiries post to the AgencyOS `submitBookingInquiry` Cloud Function (repo `E7104z/artist-app`), which validates, rate-limits, resolves the artist server-side and writes the inquiry, CRM contact, opportunity (stage `discovered`), follow-up task and audit log. The site never sends agency, artist id, stage or source.

## Structure

```
src/core/            shared components, sections, pages, styles, booking client
src/artists/<slug>/  config.ts (content), seo.json, approvals.json
src/artists/registry.ts
assets-src/<slug>/   original images (optimised by `npm run images`)
scripts/             optimize-images.mjs, check-approvals.mjs
e2e/                 Playwright booking-path tests
```

Artist resolution order: `VITE_ARTIST_SLUG` (build-time) → hostname → default artist.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on :5174 |
| `npm test` | Unit/component tests (Vitest) |
| `npm run test:e2e` | Playwright (builds, serves preview). `PW_CHANNEL=chrome` uses system Chrome |
| `npm run images` | Regenerate responsive AVIF/WebP from `assets-src` |
| `npm run check:approvals` | List unapproved items |
| `npm run build` | Approvals check, typecheck, production build |

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_ARTIST_SLUG` | Recommended | Selects the artist, e.g. `tracy-smith` |
| `VITE_BOOKING_ENDPOINT` | Yes | URL of `submitBookingInquiry`. Without it the form reports failure; it never fakes success |
| `VITE_TURNSTILE_SITE_KEY` | Production | Cloudflare Turnstile site key. The server fails closed (503) in production without its secret |
| `VITE_REQUIRE_APPROVALS` | Production | `true` fails the build while any item in `approvals.json` is unapproved |

## Approvals gate

Copy, bio, photos, video order, public contact, domain and pricing display each need the artist's/manager's sign-off, tracked in `src/artists/<slug>/approvals.json` (all `approved: false` for Tracy today). Set `VITE_REQUIRE_APPROVALS=true` on production builds so unapproved content cannot ship. The privacy page is a draft pending review.

## Adding an artist

1. Copy `src/artists/tracy-smith` to `src/artists/<slug>`; edit `config.ts`, `seo.json`, `approvals.json`.
2. Put source images in `assets-src/<slug>/`, set focal points per breakpoint, run `npm run images`.
3. Register it in `src/artists/registry.ts`.
4. Create the artist in AgencyOS with the same `slug` and `status: active` (the function resolves by it).
5. Create a Vercel project for the domain with the env vars above.

## Deploying (Vercel, one project per artist)

Set the env vars above, add the domain, and add the site origin to `ALLOWED_ORIGINS` on the Cloud Function (see `artist-app/docs/public-booking-inquiries.md`). `vercel.json` provides the SPA rewrite.

## Known gaps

Hero portrait is an upscaled video frame (replace with a professional photo); video posters are unverified against the YouTube ids; acknowledgement emails and manager notifications are tracked in AgencyOS as unfinished. The E2E tests mock the endpoint; a run against the real function on the AgencyOS emulator is still to do.
