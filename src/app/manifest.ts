import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tascurator',
    short_name: 'Tascurator',
    description:
      'Tascurator is an application designed to streamline the management of cleaning duties in a shared house.',
    start_url: '/sharehouses',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#0891b2',
    orientation: 'portrait-primary',
    lang: 'en',
    categories: ['productivity', 'home', 'lifestyle', 'social'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      { src: '/icon1.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon2.png', type: 'image/png', sizes: '512x512' },
    ],
  };
}
