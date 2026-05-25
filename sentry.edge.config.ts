import * as Sentry from '@sentry/nextjs';

/*
 * Sentry — Edge runtime config (proxy.ts, edge route handlers,
 * Image Optimization). See #43.
 *
 * Mirrors sentry.server.config.ts. Edge runtime has a thinner
 * Node-API surface, so any future server-only integrations
 * should stay out of this file.
 */
const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    sendDefaultPii: false,
    tracesSampleRate: process.env.VERCEL_ENV === 'production' ? 0.1 : 1.0,
  });
}
