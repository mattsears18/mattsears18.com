import * as Sentry from '@sentry/nextjs';

/*
 * Sentry — browser config (loaded automatically by Next.js when
 * present at the repo root). See #43.
 *
 * Uses NEXT_PUBLIC_SENTRY_DSN — Sentry DSNs are designed to be
 * public (they only authorize event submission), but the explicit
 * NEXT_PUBLIC_ prefix opts the value into Next.js's client-bundle
 * inlining and makes the public-by-design posture obvious in env
 * config.
 *
 * PII posture (per issue body acceptance criteria):
 *   - sendDefaultPii: false — no IP, no headers, no auto-captured
 *     user context.
 *   - No Sentry.replayIntegration() — DOM replays would capture
 *     page content (post bodies, drafts) which is more surface
 *     than this site needs for invisible-failure detection.
 *
 * Navigation transaction sample rate is conservative (10% in
 * prod, 100% in dev/preview) so we still see traces locally
 * without paying for them in production.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    sendDefaultPii: false,
    tracesSampleRate:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 0.1 : 1.0,
  });
}

// Next.js 15+: export the navigation-transaction hook so the SDK
// can instrument App Router client-side navigations.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
