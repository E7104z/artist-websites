/// <reference types="vitest" />
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

interface Seo {
  title: string
  description: string
  siteUrl?: string
  ogImage?: string
  structuredData?: Record<string, unknown>
}

/**
 * Bakes the selected artist's SEO into index.html (crawlers and social
 * previews do not run JavaScript), and emits robots.txt / sitemap.xml.
 * The artist is chosen at build time with VITE_ARTIST_SLUG.
 */
function artistSeo(slug: string): Plugin {
  const seo = JSON.parse(
    readFileSync(path.resolve(__dirname, `src/artists/${slug}/seo.json`), 'utf8'),
  ) as Seo
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const origin = seo.siteUrl?.replace(/\/$/, '')

  return {
    name: 'artist-seo',
    transformIndexHtml(html) {
      const og = origin && seo.ogImage ? `${origin}${seo.ogImage}` : seo.ogImage
      const tags = [
        `<title>${escape(seo.title)}</title>`,
        `<meta name="description" content="${escape(seo.description)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${escape(seo.title)}" />`,
        `<meta property="og:description" content="${escape(seo.description)}" />`,
        og ? `<meta property="og:image" content="${escape(og)}" />` : '',
        origin ? `<meta property="og:url" content="${origin}/" />` : '',
        origin ? `<link rel="canonical" href="${origin}/" />` : '',
        `<meta name="twitter:card" content="summary_large_image" />`,
        seo.structuredData
          ? `<script type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>`
          : '',
      ].filter(Boolean)
      return html.replace('<!--ARTIST_SEO-->', tags.join('\n    '))
    },
    closeBundle() {
      const out = path.resolve(__dirname, 'dist')
      try {
        writeFileSync(
          path.join(out, 'robots.txt'),
          `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`,
        )
        if (origin) {
          const urls = ['/', '/book', '/privacy']
            .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
            .join('\n')
          writeFileSync(
            path.join(out, 'sitemap.xml'),
            `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          )
        }
      } catch {
        /* dist missing during dev */
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const slug = env.VITE_ARTIST_SLUG || 'tracy-smith'
  return {
    plugins: [react(), artistSeo(slug)],
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
    server: { port: 5174, strictPort: true },
    root: path.resolve(__dirname),
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [path.resolve(__dirname, './src/test/setup.ts')],
      css: false,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  }
})
