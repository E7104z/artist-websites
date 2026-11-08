import '@fontsource-variable/dm-sans'
import '@fontsource-variable/playfair-display'
import '@fontsource-variable/playfair-display/wght-italic.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { resolveArtist } from './artists/registry'
import { App } from './core/App'
import { ArtistProvider } from './core/ArtistContext'
import { applyTheme } from './core/lib/theme'
import './core/styles/tokens.css'
import './core/styles/site.css'

const artist = resolveArtist(window.location.hostname)
applyTheme(artist)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtistProvider artist={artist}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ArtistProvider>
  </StrictMode>,
)
