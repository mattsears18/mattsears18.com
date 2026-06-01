import type { MetadataRoute } from 'next';

import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site';

/*
 * `/manifest.webmanifest` — emitted by Next from this file at build time.
 *
 * The App Router `manifest` file convention auto-injects
 * `<link rel="manifest" href="/manifest.webmanifest">` into every route's
 * <head>, which is what makes the site installable as a PWA (add-to-home-
 * screen on Android, web-app-install banners). No static asset in `public/`
 * — the manifest is generated, same pattern as `robots.ts` / `sitemap.ts`.
 *
 * Colors come from the design tokens in `app/globals.css`:
 *   - background_color `#0a0a0a` = `--color-bg` (dark, the SSR default theme)
 *   - theme_color      `#f97316` = the orange brand accent (matches the
 *     accent period in `app/apple-icon.tsx` / `app/opengraph-image.tsx`)
 *
 * Icons reference `/icon-192.png` + `/icon-512.png`. Those PNG assets are
 * owned by #144 (replace favicon.ico with modern PWA icons) — this manifest
 * names the standard paths #144 produces so the two land independently
 * without colliding. Referencing OG/Twitter images here is owned by #142.
 */
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#f97316',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
