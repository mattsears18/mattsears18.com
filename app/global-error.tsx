'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import './globals.css';

/*
 * Root error boundary — `app/global-error.tsx`.
 *
 * This is the last-resort boundary: it catches errors thrown in the *root
 * layout itself* (or anything that escapes a segment `error.tsx`). Because the
 * root layout has crashed, this component REPLACES it entirely — so it must
 * render its own `<html>` and `<body>` (the surrounding `app/layout.tsx`
 * chrome — header, footer, font variables, theme class — is gone).
 *
 * Like `app/error.tsx`, this forwards the caught error to Sentry on mount so a
 * root-render crash produces an operator signal instead of a silent broken
 * page. See #158.
 *
 * Branding caveat: with the root layout gone we don't get the `next/font`
 * CSS variables or the `.dark` class the layout normally stamps on `<html>`.
 * We import `globals.css` for the design tokens and apply `dark` directly so
 * the recovery UI stays on-theme (dark default, accent headline) rather than
 * falling back to an unstyled Next default. The `font-display` alias resolves
 * to its system-font fallback here (the Geist variable isn't injected without
 * the layout) — acceptable for a rarely-hit last-resort surface.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        <main className="mx-auto max-w-container px-6 sm:px-12">
          <section
            aria-labelledby="global-error-heading"
            className="flex min-h-screen flex-col justify-center py-16 sm:py-24"
          >
            <p className="mb-6 font-mono text-sm uppercase tracking-widest text-fg-muted">Error</p>

            <h1
              id="global-error-heading"
              className="max-w-3xl font-display text-display-sm font-medium tracking-tight text-fg sm:text-display-md"
            >
              Something broke<span className="text-accent">.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
              An unexpected error stopped this page from rendering. It&apos;s been reported
              automatically. Reload the page, or head back home.
            </p>

            <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-base sm:text-lg">
              {/*
               * Plain <a> (full navigation), not next/link: the root layout
               * crashed, so the App Router's client context this boundary
               * renders under is unreliable. A hard navigation re-bootstraps
               * the app from scratch. This is also what the @sentry/nextjs +
               * Next.js global-error examples use.
               */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="text-accent underline-offset-4 hover:underline">
                Home →
              </a>
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
