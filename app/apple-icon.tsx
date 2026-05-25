import { ImageResponse } from 'next/og';

/*
 * Apple touch icon (180×180). Renders at build time via `next/og`
 * ImageResponse — no static PNG asset committed to the repo. Next.js's
 * `apple-icon` file convention auto-injects the corresponding
 * `<link rel="apple-touch-icon" sizes="180x180" type="image/png" ...>`
 * tag into every route's <head> (see app-icons docs).
 *
 * Design follows the same language as `app/opengraph-image.tsx`:
 * near-black background, sans monogram, orange accent period. iOS
 * rounds the corners automatically on home-screen — no need to mask
 * here. 180×180 is Apple's current default; the smaller 152/167
 * variants are auto-derived by Safari from the 180 source.
 */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fafaf9',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        MS
        <span style={{ color: '#f97316' }}>.</span>
      </div>
    </div>,
    size,
  );
}
