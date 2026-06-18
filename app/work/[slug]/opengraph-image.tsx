import { promises as fs } from 'node:fs';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { getProjectBySlug } from '@/lib/work';
import { SITE_TITLE, SITE_URL } from '@/lib/site';

/*
 * Per-project Open Graph image.
 *
 * When a project defines a hero image (`frontmatter.image`, the first
 * image on the page), we serve that image as the card — letterboxed on
 * the dark site background so it reads as a deliberate share card rather
 * than a cropped thumbnail. Projects without a hero fall back to the
 * generated text card below: title-aware, role/year eyebrow, dark
 * site-card visual language — so each project page still gets a distinct
 * card instead of inheriting nothing (the page's own
 * `generateMetadata.openGraph` would otherwise shallow-replace the root
 * segment's image and leave the route with no card image at all; see
 * issue #55). It mirrors the per-post pattern in
 * `app/blog/[slug]/opengraph-image.tsx`.
 *
 * `generateImageMetadata` is called per route invocation with the
 * matched `params`; we return exactly one entry keyed on the slug
 * so the route emits one og:image tag per page instead of N (one
 * per project — `generateImageMetadata` is NOT auto-filtered by the
 * runtime). `generateStaticParams` on the page handles enumerating
 * all slugs at build time.
 */
export const alt = `${SITE_TITLE} — Work`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

/**
 * Read a public-root hero path (e.g. `/work/shipyard.png`) off disk and
 * return it as a data URI for embedding in the ImageResponse. Returns
 * `null` if the file can't be read so the renderer falls back to the
 * generated text card. `lib/work.ts` already strips `frontmatter.image`
 * when the asset is missing, so the read normally succeeds.
 */
async function loadHeroDataUri(image: string): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', image);
    const bytes = await fs.readFile(filePath);
    const mime = MIME_BY_EXT[path.extname(image).toLowerCase()] ?? 'image/png';
    return `data:${mime};base64,${bytes.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function generateImageMetadata({ params }: { params?: { slug?: string } }) {
  const slug = params?.slug ?? 'work';
  const project = slug !== 'work' ? await getProjectBySlug(slug) : null;
  const altText = project
    ? (project.frontmatter.imageAlt ?? `${project.frontmatter.title} — ${SITE_TITLE}`)
    : alt;
  return [
    {
      id: slug,
      alt: altText,
      size,
      contentType,
    },
  ];
}

export default async function ProjectOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // Prefer the project's hero image — the first image on the page — as the
  // share card. Letterbox it (objectFit: contain) on the dark site background
  // so baked-in titles/edges stay intact instead of being cropped.
  const heroImage = project?.frontmatter.image;
  if (heroImage) {
    const dataUri = await loadHeroDataUri(heroImage);
    if (dataUri) {
      return new ImageResponse(
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
          }}
        >
          <img
            src={dataUri}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>,
        size,
      );
    }
  }

  const title = project?.frontmatter.title ?? SITE_TITLE;
  const role = project?.frontmatter.role ?? '';
  const year = project?.frontmatter.year ?? '';

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
        <span>{SITE_URL.replace(/^https?:\/\//, '')}/work</span>
        {year ? <span>{year}</span> : null}
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
          {role || 'Work'}
        </div>
        <div
          style={{
            fontSize: title.length > 40 ? 64 : 80,
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
