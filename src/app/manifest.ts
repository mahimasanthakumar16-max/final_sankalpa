import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sankalpa Counseling | Premium Psychotherapy',
    short_name: 'Sankalpa Therapy',
    description: 'A premium modern therapy private practice providing safe, calming, and professional psychotherapy and counseling.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F4EE',
    theme_color: '#7D9182',
    icons: [
      {
        src: '/images/LOTO.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
