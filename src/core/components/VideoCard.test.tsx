import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { tracySmith } from '@/artists/tracy-smith/config'
import { VideoCard } from './VideoCard'

describe('VideoCard', () => {
  const video = tracySmith.performances.items[0]

  it('shows the real YouTube player (privacy-enhanced, lazy, no autoplay) instead of a cover image', () => {
    const { container } = render(<VideoCard video={video} sizes="100vw" large />)
    const frame = container.querySelector('iframe')!
    expect(frame.src).toContain('https://www.youtube-nocookie.com/embed/')
    expect(frame.src).toContain(video.youtubeId)
    expect(frame.src).not.toContain('autoplay=1')
    expect(frame.getAttribute('loading')).toBe('lazy')
    expect(container.querySelector('img')).toBeNull()
  })

  it('gives a self-hosted video poster meaningful alt text', () => {
    const own = { ...video, youtubeId: undefined, src: '/artists/test/video.mp4' }
    render(<VideoCard video={own} sizes="100vw" large />)
    expect(screen.getByAltText(video.poster.alt)).toBeInTheDocument()
  })

  it('plays a self-hosted video only after a click, with no preload', async () => {
    const own = { ...video, youtubeId: undefined, src: '/artists/test/video.mp4' }
    const { container } = render(<VideoCard video={own} sizes="100vw" />)
    expect(container.querySelector('video')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: /play video/i }))
    const el = container.querySelector('video')!
    expect(el.getAttribute('src')).toBe(own.src)
    expect(el.getAttribute('preload')).toBe('none')
    expect(container.querySelector('iframe')).toBeNull()
  })
})
