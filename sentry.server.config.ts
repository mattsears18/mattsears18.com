import * as Sentry from '@sentry/nextjs';

/*
 * Sentry — Node.js runtime config (server components, route handlers,
 * generateMetadata, generateStaticParams). See #43.
 *
 * PII posture (per issue body acceptance criteria):
 *   - sendDefaultPii: false — do NOT attach request headers, IP, or user
 *     info automatically. The previous default-on behavior captures
 *     `cookie`, `authorization`, `x-forwarded-for`, and any user object
 *     present on the request, which is more than this site needs.
 *   - environment from VERCEL_ENV so production alerts aren't mixed
 *     with preview-deploy noise.
 *
 * No DSN → no init. The block is a soft-fail so the site still
 * builds and runs without the env var (local dev, CI, missing
 * Vercel env). Sentry's own logs note the silent-init in dev only.
 */
const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    sendDefaultPii: false,
    // 10% trace sample in production; 100% in dev/preview so local-repro
    // events always show up. Personal-site traffic doesn't justify
    // higher rates.
    tracesSampleRate: process.env.VERCEL_ENV === 'production' ? 0.1 : 1.0,
    // No replays / profiling on the server runtime — those are
    // browser-only features.
  });
}
