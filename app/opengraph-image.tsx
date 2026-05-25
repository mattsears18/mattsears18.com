import { ImageResponse } from 'next/og';

import { SITE_TAGLINE, SITE_TITLE, SITE_URL } from '@/lib/site';

/*
 * Site-wide Open Graph image (1200×630). Renders at build time via Next's
 * `next/og` ImageResponse — no static asset required. Routes that want a
 * custom image (e.g. blog post pages) ship their own `opengraph-image.tsx`
 * in the matching route segment, which overrides this one for that route.
 *
 * Design language matches the landing hero: dark background, sans display
 * type with a trailing accent period. We don't pull in the site's color
 * tokens via Tailwind here because ImageResponse renders in a sandboxed
 * Satori environment that doesn't see the Tailwind layer.
 */
export const alt = `${SITE_TITLE} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 96px',
        background: '#0a0a0a',
        color: '#f5f5f5',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 22,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#a3a3a3',
          fontFamily: 'monospace',
        }}
      >
        {SITE_URL.replace(/^https?:\/\//, '')}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            display: 'flex',
          }}
        >
          {SITE_TITLE}
          <span style={{ color: '#f97316' }}>.</span>
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#d4d4d4',
            lineHeight: 1.25,
            maxWidth: 880,
            display: 'flex',
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    </div>,
    size,
  );
}
