import { ImageResponse } from 'next/og';

import { SITE_TITLE, SITE_URL } from '@/lib/site';

/*
 * `/blog` index Open Graph image. Without this file, the index page's
 * `metadata.openGraph` shallow-overrides the root segment's image and
 * social cards render with no preview — see issue #55. Visual language
 * matches the per-post card (`Writing` eyebrow, accent period) so the
 * index reads as a sibling of the post pages rather than a one-off.
 */
export const alt = `${SITE_TITLE} — Blog`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function BlogOpengraphImage() {
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
        {SITE_URL.replace(/^https?:\/\//, '')}/blog
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#f97316',
            fontFamily: 'monospace',
            display: 'flex',
          }}
        >
          Writing
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            display: 'flex',
          }}
        >
          Blog
          <span style={{ color: '#f97316' }}>.</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#d4d4d4',
            lineHeight: 1.3,
            maxWidth: 880,
            display: 'flex',
          }}
        >
          Notes on engineering practice — systems, operations, the work of leading teams that ship.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 28,
          color: '#d4d4d4',
          fontFamily: 'sans-serif',
        }}
      >
        {SITE_TITLE}
        <span style={{ color: '#f97316' }}>.</span>
      </div>
    </div>,
    size,
  );
}
