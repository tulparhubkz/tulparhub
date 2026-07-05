import type { MetadataRoute } from 'next'

// PWA install manifest (#51). Icons are rasterized from the brand mark; swap
// them for designed artwork when it exists — the sizes must stay.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TulparHub — запчасти для грузовиков и спецтехники',
    short_name: 'TulparHub',
    description:
      'Запчасти для грузовиков и спецтехники в Казахстане. OEM и аналоги, наличие на складах, доставка по РК.',
    lang: 'ru',
    start_url: '/ru',
    scope: '/',
    display: 'standalone',
    background_color: '#f6f7fb',
    theme_color: '#0a1a4f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
