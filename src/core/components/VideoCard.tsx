import { useState } from 'react'
import { track } from '../lib/analytics'
import type { PerformanceVideo } from '../types'
import { Picture } from './Picture'

/**
 * YouTube clips show the real player (privacy-enhanced youtube-nocookie.com
 * embed, lazy-loaded, no autoplay) so the card always shows the actual video
 * rather than an unrelated cover image. Self-hosted clips are click-to-play
 * with a poster taken from the clip itself, and nothing is preloaded.
 */
export function VideoCard({ video, sizes, large = false }: { video: PerformanceVideo; sizes: string; large?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const embedded = !video.src && !!video.youtubeId

  return (
    <figure className={`media-item${large ? ' featured' : ''}`}>
      <div className={`media-card${large ? '' : ' secondary'}${embedded || playing ? ' live' : ''}`}>
        {playing && video.src ? (
          <video
            className="media-frame media-video"
            src={video.src}
            controls
            autoPlay
            playsInline
            preload="none"
            aria-label={`${video.title} — video`}
          />
        ) : embedded ? (
          <iframe
            className="media-frame"
            title={`${video.title} — video`}
            loading="lazy"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <>
            <Picture image={video.poster} sizes={sizes} className="media-poster" />
            <button
              type="button"
              className="play"
              aria-label={`Play video: ${video.title}`}
              onClick={() => {
                track('video_play', { video: video.id })
                setPlaying(true)
              }}
            >
              <span aria-hidden="true">▶</span>
            </button>
          </>
        )}
      </div>
      <figcaption className="media-caption">
        <small>{video.kicker}</small>
        <span>{video.title}</span>
      </figcaption>
    </figure>
  )
}
