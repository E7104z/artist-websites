import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { tracySmith } from '@/artists/tracy-smith/config'
import { VideoCard } from './VideoCard'

describe('VideoCard', () => {
  const video = tracySmith.performances.items[0]

  it('loads nothing from YouTube until the visitor clicks play', async () => {
    const { container } = render(<VideoCard video={video} sizes="100vw" large />)
    expect(container.querySelector('iframe')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /play video/i }))
    const frame = container.querySelector('iframe')!
    expect(frame.src).toContain('https://www.youtube-nocookie.com/embed/')
    expect(frame.src).toContain(video.youtubeId)
  })

  it('gives the poster meaningful alt text', () => {
    render(<VideoCard video={video} sizes="100vw" large />)
    expect(screen.getByAltText(video.poster.alt)).toBeInTheDocument()
  })
})
