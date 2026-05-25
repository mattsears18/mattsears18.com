import { ImageResponse } from 'next/og';

import { getPostBySlug } from '@/lib/posts';
import { SITE_TITLE, SITE_URL } from '@/lib/site';

/*
 * Per-post Open Graph image. Pulls the post title + date from the MDX
 * frontmatter so each post page gets a card with its actual title rather
 * than the generic site card. Falls back to the site card layout if the
 * slug doesn't resolve (shouldn't happen — generateStaticParams gates it).
 *
 * `generateImageMetadata` is called per route invocation with the
 * matched `params`; we return exactly one entry keyed on the slug
 * so the route emits one og:image tag per page instead of N (one
 * per post — `generateImageMetadata` is NOT auto-filtered by the
 * runtime). `generateStaticParams` on the page handles enumerating
 * all slugs at build time. Mirrors the per-project pattern in
 * `app/work/[slug]/opengraph-image.tsx` (see issue #91).
 *
 * Next 16 gotcha: in `generateImageMetadata`, `params` is a plain
 * object — but in the default export below, `params` is a Promise.
 * Mixing them silently breaks `id` resolution at build time.
 */
export const alt = `${SITE_TITLE} — Blog`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params?: { slug?: string } }) {
  const slug = params?.slug ?? 'blog';
  const post = slug !== 'blog' ? await getPostBySlug(slug) : null;
  const altText = post ? `${post.frontmatter.title} — ${SITE_TITLE}` : alt;
  return [
    {
      id: slug,
      alt: altText,
      size,
      contentType,
    },
  ];
}

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.frontmatter.title ?? SITE_TITLE;
  const date = post?.frontmatter.date ?? '';

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
          justifyContent: 'space-between',
          fontSize: 22,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#a3a3a3',
          fontFamily: 'monospace',
        }}
      >
        <span>{SITE_URL.replace(/^https?:\/\//, '')}/blog</span>
        {date ? <span>{date}</span> : null}
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
            fontSize: title.length > 60 ? 60 : 72,
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            maxWidth: 1000,
            display: 'flex',
          }}
        >
          {title}
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
