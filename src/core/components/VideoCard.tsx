import { useState } from 'react'
import { track } from '../lib/analytics'
import type { PerformanceVideo } from '../types'
import { Picture } from './Picture'

/**
 * Click-to-play. Nothing from YouTube loads — no player, cookies or requests —
 * until the visitor presses play, and then only the privacy-enhanced
 * (youtube-nocookie.com) embed. No autoplay-with-sound before a click.
 */
export function VideoCard({ video, sizes, large = false }: { video: PerformanceVideo; sizes: string; large?: boolean }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`media-card${large ? '' : ' secondary'}`}>
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
      ) : playing && video.youtubeId ? (
        <iframe
          className="media-frame"
          title={`${video.title} — video`}
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
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
          <div className="media-title">
            <small>{video.kicker}</small>
            {video.title}
          </div>
        </>
      )}
    </div>
  )
}
