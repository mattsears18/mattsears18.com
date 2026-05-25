import * as Sentry from '@sentry/nextjs';

/*
 * Next.js instrumentation hook — see #43.
 *
 * Wires Sentry into the Node and Edge runtimes per Next.js's
 * recommended convention. The runtime-specific init lives in
 * `sentry.server.config.ts` and `sentry.edge.config.ts`; the
 * browser init lives in `instrumentation-client.ts` (Next.js
 * loads that file automatically on the client).
 *
 * `onRequestError` is exported so Next.js routes server-side
 * errors (Server Components, route handlers, the proxy) through
 * Sentry's request-context capture, which preserves the request
 * URL / headers on the event.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
