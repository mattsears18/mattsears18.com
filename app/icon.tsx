import { ImageResponse } from 'next/og';

/*
 * App icons (192×192 + 512×512), generated at build time via `next/og`
 * ImageResponse — no static PNG assets committed to the repo. Next.js's
 * `icon` file convention auto-injects the matching
 * `<link rel="icon" type="image/png" sizes="WxH" ...>` tags into every
 * route's <head> (see app-icons docs), and `generateImageMetadata` lets a
 * single file emit more than one size.
 *
 * 192 and 512 are the modern PWA sizes — 192 is the Android home-screen
 * icon, 512 the splash-screen / app-drawer source. They replace the legacy
 * oversized `favicon.ico` for high-DPI tabs and installs; the trimmed
 * 32×32 `favicon.ico` stays only for older browsers that don't read the
 * PNG <link> tags. The PWA web manifest that references these (for the
 * full install experience) is owned by a sibling issue (#141) and is
 * intentionally not added here.
 *
 * Design follows the same language as `app/apple-icon.tsx` and
 * `app/opengraph-image.tsx`: near-black background, sans monogram, orange
 * accent period. The monogram font size scales with the icon edge so the
 * "MS." reads identically at both sizes.
 */
export const contentType = 'image/png';

export function generateImageMetadata() {
  return [
    { id: '192', contentType, size: { width: 192, height: 192 } },
    { id: '512', contentType, size: { width: 512, height: 512 } },
  ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const edge = Number(await id);

  return new ImageResponse(
    (
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
            // ~0.53× the edge keeps the monogram visually identical to the
            // 96px-on-180px apple-icon ratio across both generated sizes.
            fontSize: Math.round(edge * 0.53),
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          MS
          <span style={{ color: '#f97316' }}>.</span>
        </div>
      </div>
    ),
    { width: edge, height: edge },
  );
}
