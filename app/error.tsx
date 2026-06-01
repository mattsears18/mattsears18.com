'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

/*
 * Route-segment error boundary — `app/error.tsx`.
 *
 * In the App Router, an uncaught exception thrown while *rendering a Client
 * Component* (or re-thrown into render from a client event handler) is caught
 * by the nearest `error.tsx` boundary. `instrumentation.ts`'s `onRequestError`
 * only sees *server-side* errors — it never sees client render crashes — so
 * without this boundary forwarding to Sentry those errors render a fallback UI
 * and produce ZERO operator signal (no event, no alert, no stack trace).
 * See #158 (and the deferred criterion on the now-closed #43).
 *
 * This file renders INSIDE the root layout's `<main>` (the root layout itself
 * survived; only a child segment crashed), so it inherits the site header,
 * footer, fonts, theme tokens, and container width — same chrome as
 * `app/not-found.tsx`. Layout-level crashes that escape the root layout fall
 * through to `app/global-error.tsx` instead.
 *
 * `reset()` re-renders the segment that threw — a cheap retry for transient
 * failures (a flaky fetch, a hydration race) without a full page reload.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <section
      aria-labelledby="error-heading"
      className="flex min-h-[60vh] flex-col justify-center py-16 sm:py-24"
    >
      <p className="mb-6 font-mono text-sm uppercase tracking-widest text-fg-muted">Error</p>

      <h1
        id="error-heading"
        className="max-w-3xl font-display text-display-sm font-medium tracking-tight text-fg sm:text-display-md"
      >
        Something broke<span className="text-accent">.</span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
        An unexpected error stopped this page from rendering. It&apos;s been reported automatically.
        Try again, or head back home.
      </p>

      <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-base sm:text-lg">
        <button
          type="button"
          onClick={reset}
          className="text-accent underline-offset-4 hover:underline"
        >
          Try again →
        </button>
        <Link href="/" className="text-accent underline-offset-4 hover:underline">
          Home →
        </Link>
      </p>
    </section>
  );
}
