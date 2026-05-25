import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE_TITLE } from '@/lib/site';

/*
 * Root 404 — `app/not-found.tsx`.
 *
 * Next.js routes here in two cases:
 *   1. The top-level catch-all: any URL that doesn't match a route in the
 *      App Router segment tree (e.g. `/nonexistent-page-test`).
 *   2. Any `notFound()` call from a deeper segment that doesn't have its own
 *      `not-found.tsx` (e.g. `app/blog/[slug]/page.tsx` calls `notFound()`
 *      for an unknown slug, which falls through to this file).
 *
 * This file renders INSIDE the root layout's `<main>`, so it inherits the
 * site header, footer, fonts, theme tokens, and container width — same
 * chrome as every other page. We add only what the 404 page itself needs:
 * the headline, an owning line of copy, and three recovery links.
 *
 * Title is set to an `absolute` value (rather than the layout's template-
 * wrapped default) so it's consistent across BOTH 404 surfaces — top-level
 * catch-all and dynamic-segment `notFound()` — and never collides with the
 * homepage's own `absolute: SITE_TITLE` ([#75](https://github.com/mattsears18/mattsears18.com/issues/75)).
 *
 * The HTTP response stays `404` automatically — Next.js sets the status from
 * the `not-found.tsx` convention; no `redirect()` here, no soft-redirect to
 * `/`. See https://nextjs.org/docs/app/api-reference/file-conventions/not-found.
 */
export const metadata: Metadata = {
  title: { absolute: `Not found — ${SITE_TITLE}` },
  description: 'That URL does not point at anything here.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="flex min-h-[60vh] flex-col justify-center py-16 sm:py-24"
    >
      <p className="mb-6 font-mono text-sm uppercase tracking-widest text-fg-muted">404</p>

      <h1
        id="not-found-heading"
        className="max-w-3xl font-display text-display-sm font-medium tracking-tight text-fg sm:text-display-md"
      >
        Not found<span className="text-accent">.</span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
        That URL doesn&apos;t point at anything here. The link may have rotted, or the page may have
        moved. Here&apos;s where to go next.
      </p>

      <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-base sm:text-lg">
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Home →
        </Link>
        <Link href="/work" className="text-accent underline-offset-4 hover:underline">
          Work →
        </Link>
        <Link href="/blog" className="text-accent underline-offset-4 hover:underline">
          Blog →
        </Link>
      </p>
    </section>
  );
}
