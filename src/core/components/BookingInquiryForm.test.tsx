import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tracySmith } from '@/artists/tracy-smith/config'
import { ArtistProvider } from '../ArtistContext'
import { ThanksPage } from '../pages/ThanksPage'
import { BookingInquiryForm } from './BookingInquiryForm'

vi.stubEnv('VITE_BOOKING_ENDPOINT', 'https://api.test/submit')

function setup() {
  return render(
    <ArtistProvider artist={tracySmith}>
      <MemoryRouter initialEntries={['/book']}>
        <Routes>
          <Route path="/book" element={<BookingInquiryForm />} />
          <Route path="/thanks" element={<ThanksPage />} />
        </Routes>
      </MemoryRouter>
    </ArtistProvider>,
  )
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/your name/i), 'Sample Booker')
  await user.type(screen.getByLabelText(/email address/i), 'booker@example.com')
  await user.selectOptions(screen.getByLabelText(/event type/i), 'corporate')
  await user.click(screen.getByLabelText(/date to be determined/i))
  await user.type(screen.getByLabelText(/event city/i), 'St. Louis')
  await user.type(screen.getByLabelText(/^state/i), 'MO')
  await user.click(screen.getByLabelText(/may contact me about this inquiry/i))
}

afterEach(() => vi.unstubAllGlobals())

describe('BookingInquiryForm', () => {
  it('shows inline errors and sends nothing when required fields are missing', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByRole('button', { name: /send booking inquiry/i }))
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument()
    expect(screen.getByText(/confirm we may contact you/i)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('has a hidden honeypot and a separate, unchecked marketing consent', () => {
    setup()
    const honeypot = screen.getByLabelText(/leave this field empty/i)
    expect(honeypot).toHaveValue('')
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(screen.getByLabelText(/news about tracy/i)).not.toBeChecked()
  })

  it('posts the right payload and shows thanks only after the server confirms', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 201, json: async () => ({ ok: true, reference: 'INQ-ABCD1234', duplicate: false }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    setup()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send booking inquiry/i }))

    await waitFor(() => expect(screen.getByText('INQ-ABCD1234')).toBeInTheDocument())
    expect(screen.getByText(/your inquiry has been received/i)).toBeInTheDocument()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test/submit')
    const body = JSON.parse(init.body)
    expect(body).toMatchObject({
      artistSlug: 'tracy-smith',
      contact: { name: 'Sample Booker', email: 'booker@example.com' },
      event: { type: 'corporate', dateStatus: 'tbd', city: 'St. Louis', state: 'MO' },
      consentToContact: true, marketingConsent: false, website: '',
    })
  })

  it('never claims success when the server fails, and a retry works', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ ok: false, error: 'server_error' }) })
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => ({ ok: true, reference: 'INQ-RETRY001', duplicate: false }) })
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    setup()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send booking inquiry/i }))

    expect(await screen.findByText(/we couldn’t submit your request/i)).toBeInTheDocument()
    expect(screen.queryByText(/has been received/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/your name/i)).toHaveValue('Sample Booker') // nothing lost

    await user.click(screen.getByRole('button', { name: /send booking inquiry/i }))
    await waitFor(() => expect(screen.getByText('INQ-RETRY001')).toBeInTheDocument())
  })

  it('shows server validation messages next to the field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 400,
      json: async () => ({ ok: false, issues: [{ path: 'contact.email', message: 'Invalid email' }] }),
    }))
    const user = userEvent.setup()
    setup()
    await fillValid(user)
    await user.click(screen.getByRole('button', { name: /send booking inquiry/i }))
    expect(await screen.findByText('Invalid email')).toBeInTheDocument()
  })
})

describe('ThanksPage', () => {
  it('does not claim anything was submitted when opened directly', () => {
    render(
      <ArtistProvider artist={tracySmith}>
        <MemoryRouter initialEntries={['/thanks']}>
          <Routes><Route path="/thanks" element={<ThanksPage />} /></Routes>
        </MemoryRouter>
      </ArtistProvider>,
    )
    expect(screen.getByText(/no inquiry to show/i)).toBeInTheDocument()
    expect(screen.queryByText(/has been received/i)).not.toBeInTheDocument()
  })
})
