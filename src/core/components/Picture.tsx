import type { CSSProperties } from 'react'
import type { ImageSet } from '../types'

interface PictureProps {
  image: ImageSet
  sizes: string
  className?: string
  /** Hero images load eagerly; everything below the fold is lazy. */
  priority?: boolean
}

const srcSet = (image: ImageSet, ext: 'avif' | 'webp') =>
  image.widths.map((w) => `${image.base}-${w}.${ext} ${w}w`).join(', ')

/** Responsive AVIF/WebP image with per-breakpoint focal points so the face stays in frame. */
export function Picture({ image, sizes, className, priority = false }: PictureProps) {
  const largest = Math.max(...image.widths)
  const style = {
    '--focal-m': `${image.focal.mobile.x}% ${image.focal.mobile.y}%`,
    '--focal-d': `${image.focal.desktop.x}% ${image.focal.desktop.y}%`,
  } as CSSProperties

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(image, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, 'webp')} sizes={sizes} />
      <img
        className={['focal-image', className].filter(Boolean).join(' ')}
        style={style}
        src={`${image.base}-${largest}.webp`}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
      />
    </picture>
  )
}
