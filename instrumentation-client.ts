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
 * Lazy-loaded off the initial critical path — see #215.
 *
 * The `@sentry/nextjs` client SDK is a ~410 KiB chunk that Lighthouse
 * flagged as ~64.6% unused on first load. A static `import * as Sentry`
 * here forces that chunk into the initial critical path (it shows up in
 * the root `build-manifest.json` and every page's build manifest), so it
 * blocks parse/compile on every navigation even though nothing on the
 * page needs it synchronously.
 *
 * Sentry's own bundle-trimming levers (`webpack.treeshake` /
 * `bundleSizeOptimizations` on `withSentryConfig`, and the
 * `__SENTRY_TRACING__` define) only fire under the webpack plugin
 * codepath; this site builds with Turbopack, where they're inert
 * (verified empirically in #136 + #215 — config-only and `compiler.define`
 * both gave a ~0-byte delta because Turbopack keeps the unused integration
 * module that the define-guarded call site no longer references). Moving
 * the SDK off the critical path is the lever that actually works here.
 *
 * We defer the dynamic `import('@sentry/nextjs')` to browser idle time
 * (`requestIdleCallback`, falling back to a short `setTimeout`) so the SDK
 * loads as a separate, non-blocking chunk after first paint. Error capture
 * — the reason Sentry is wired in — is preserved; the only behavioral
 * change is a brief window at the very start of the session before the SDK
 * has initialized, which is an acceptable trade for keeping ~400 KiB off
 * the critical path on a low-traffic personal site.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Holds the loaded SDK module once the deferred import resolves, so the
// router-transition hook below can forward to it.
type SentryModule = typeof import('@sentry/nextjs');
let sentryModule: SentryModule | null = null;

function initSentry(): void {
  if (!dsn) return;

  import('@sentry/nextjs')
    .then((Sentry) => {
      sentryModule = Sentry;
      Sentry.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
        sendDefaultPii: false,
        tracesSampleRate: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 0.1 : 1.0,
      });
    })
    .catch(() => {
      // Sentry failing to load must never break the page — swallow.
    });
}

if (typeof window !== 'undefined' && dsn) {
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback;
  if (typeof ric === 'function') {
    ric(initSentry);
  } else {
    // Safari has no requestIdleCallback; defer past first paint instead.
    window.setTimeout(initSentry, 0);
  }
}

/*
 * Next.js 15+: export the navigation-transaction hook so the SDK can
 * instrument App Router client-side navigations. Because the SDK is now
 * loaded lazily, this forwards to the real hook once it's available and
 * is a no-op before then (navigations that happen in the first few
 * hundred ms of a cold session simply aren't traced — acceptable for a
 * personal site, and tracing accuracy on the very first navigation was
 * already best-effort).
 */
export function onRouterTransitionStart(
  ...args: Parameters<SentryModule['captureRouterTransitionStart']>
): void {
  sentryModule?.captureRouterTransitionStart(...args);
}
