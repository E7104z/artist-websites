import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { tracySmith } from '@/artists/tracy-smith/config'
import { App } from './App'
import { ArtistProvider } from './ArtistContext'

function renderAt(path: string) {
  window.scrollTo = (() => {}) as typeof window.scrollTo
  return render(
    <ArtistProvider artist={tracySmith}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ArtistProvider>,
  )
}

describe('homepage', () => {
  it('leads with the artist name and two calls to action', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tracy Smith.')
    const hero = document.getElementById('home')!
    expect(within(hero).getByRole('link', { name: /book tracy/i })).toBeInTheDocument()
    expect(within(hero).getByRole('link', { name: /watch performances/i })).toBeInTheDocument()
    expect(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: /book tracy/i })).toBeInTheDocument()
  })

  it('uses "Book Tracy" for the primary CTA and avoids unapproved claims', () => {
    renderAt('/')
    expect(screen.queryByText(/available for event inquiries/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/award|sold[- ]out|testimonial/i)).not.toBeInTheDocument()
  })

  it('has semantic headings in order and an associated form', () => {
    renderAt('/')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(4)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
  })
})

describe('media', () => {
  it('lists every performance video, including the self-hosted clips', () => {
    renderAt('/')
    for (const v of tracySmith.performances.items) {
      expect(screen.getByRole('button', { name: `Play video: ${v.title}` })).toBeInTheDocument()
    }
    expect(tracySmith.performances.items.filter((v) => v.src)).toHaveLength(2)
  })

  it('shows the gallery with a nav link and numbers sections without gaps', () => {
    renderAt('/')
    const gallery = document.getElementById('gallery')!
    for (const photo of tracySmith.gallery!.items) {
      expect(within(gallery).getByAltText(photo.alt)).toBeInTheDocument()
    }
    expect(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Gallery' })).toBeInTheDocument()
    const labels = [...document.querySelectorAll('main section .label, section .label')]
      .map((el) => el.textContent!.slice(0, 2))
    expect([...new Set(labels)]).toEqual(['01', '02', '03', '04', '05'])
  })
})

describe('routes', () => {
  it.each([['/book', /let’s make it memorable/i], ['/privacy', /privacy notice/i], ['/nope', /isn’t here/i]])(
    '%s renders', (path, text) => {
      renderAt(path as string)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(text as RegExp)
    })
})
