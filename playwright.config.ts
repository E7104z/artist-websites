import { defineConfig } from '@playwright/test'

// Uses the system Chrome when PW_CHANNEL=chrome (e.g. in CI sandboxes without
// downloaded browsers); otherwise Playwright's bundled Chromium.
const channel = process.env.PW_CHANNEL === 'chrome' ? 'chrome' : undefined

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', channel },
  projects: [
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120_000,
    env: { VITE_BOOKING_ENDPOINT: 'https://api.test/submitBookingInquiry' },
  },
})
