// Generates responsive AVIF + WebP variants from assets-src/<artist>/*.{png,jpg}
// into public/artists/<artist>/<name>-<width>.{avif,webp}. Never upscales.
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const srcRoot = path.join(root, 'assets-src')
const outRoot = path.join(root, 'public', 'artists')
const WIDTHS = [480, 768, 1200, 1600, 2000]

for (const artist of await readdir(srcRoot)) {
  const outDir = path.join(outRoot, artist)
  await mkdir(outDir, { recursive: true })
  for (const file of await readdir(path.join(srcRoot, artist))) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue
    const name = path.parse(file).name
    const input = sharp(path.join(srcRoot, artist, file))
    const { width = 0, height = 0 } = await input.metadata()
    const widths = [...new Set([...WIDTHS.filter((w) => w < width), width])].sort((a, b) => a - b)
    for (const w of widths) {
      const resized = input.clone().resize({ width: w, withoutEnlargement: true })
      await resized.clone().webp({ quality: 82 }).toFile(path.join(outDir, `${name}-${w}.webp`))
      await resized.clone().avif({ quality: 58 }).toFile(path.join(outDir, `${name}-${w}.avif`))
    }
    console.log(`${artist}/${name}: ${width}x${height} -> ${widths.join(', ')}`)
  }
}
