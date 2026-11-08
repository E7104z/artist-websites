import { expect, test, type Page } from '@playwright/test'

const ENDPOINT = '**/submitBookingInquiry'

async function fill(page: Page) {
  await page.goto('/book')
  await page.getByLabel(/your name/i).fill('Sample Booker')
  await page.getByLabel(/email address/i).fill('booker@example.com')
  await page.getByLabel(/event type/i).selectOption('corporate')
  await page.getByLabel(/date to be determined/i).check()
  await page.getByLabel(/event city/i).fill('St. Louis')
  await page.getByLabel(/^state/i).fill('MO')
  await page.getByLabel(/may contact me about this inquiry/i).check()
}

test('home page: face-first hero and Book Tracy CTA scrolls to the booking form', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tracy Smith')
  await expect(page.locator('#home').getByRole('link', { name: /book tracy/i })).toBeVisible()
  await page.locator('#home').getByRole('link', { name: /book tracy/i }).click()
  await expect(page).toHaveURL(/#booking$/)
  await expect(page.getByLabel(/your name/i)).toBeInViewport()
})

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(() => {
    const g = globalThis as any
    return g.document.documentElement.scrollWidth - g.innerWidth
  })
  expect(overflow).toBeLessThanOrEqual(0)
})

test('submit succeeds only after the server confirms', async ({ page }) => {
  let body: any
  await page.route(ENDPOINT, async (route) => {
    body = route.request().postDataJSON()
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ ok: true, reference: 'INQ-E2E00001', duplicate: false }) })
  })
  await fill(page)
  await page.getByRole('button', { name: /send booking inquiry/i }).click()
  await expect(page.getByText('INQ-E2E00001')).toBeVisible()
  expect(body.artistSlug).toBe('tracy-smith')
  expect(body.website).toBe('')
  expect(body).not.toHaveProperty('agencyId')
})

test('server failure shows an error, keeps the data, and never shows success', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false}' }))
  await fill(page)
  await page.getByRole('button', { name: /send booking inquiry/i }).click()
  await expect(page.getByText(/couldn’t submit your request/i)).toBeVisible()
  await expect(page.getByText(/has been received/i)).toHaveCount(0)
  await expect(page.getByLabel(/your name/i)).toHaveValue('Sample Booker')
})

test('network outage is handled like a failure', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.abort('connectionrefused'))
  await fill(page)
  await page.getByRole('button', { name: /send booking inquiry/i }).click()
  await expect(page.getByText(/couldn’t submit your request/i)).toBeVisible()
})

test('direct visit to /thanks claims nothing', async ({ page }) => {
  await page.goto('/thanks')
  await expect(page.getByText(/no inquiry to show/i)).toBeVisible()
})
