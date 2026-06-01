import pino from 'pino';

import * as Sentry from '@sentry/nextjs';

/**
 * Structured, leveled logger for the site's server-side code paths. See #170.
 *
 * Why structured logging on a static content site: the build-time content
 * readers (`lib/posts.ts`, `lib/work.ts`) report malformed-MDX failures to
 * Sentry and skip the bad file (see #153). That keeps the operator breadcrumb,
 * but the failures otherwise leave no JSON-searchable record in the build/
 * runtime log stream. `pino` gives us leveled JSON with contextual fields so a
 * log aggregator (Vercel log drains, etc.) can search and correlate on `op` /
 * `slug` instead of grepping unstructured `console.*` text.
 *
 * Scope is intentionally small and server-only: this module imports `pino`,
 * which is a Node-runtime library. Import it from server/build-time code
 * (Server Components, route handlers, the content readers) — never from a
 * `'use client'` module or an edge-runtime path.
 *
 * Level honors `LOG_LEVEL` (env) and falls back to `info` in production /
 * `debug` everywhere else, so local runs surface more detail without
 * environment-specific code.
 */
function defaultLevel(): pino.LevelWithSilent {
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL as pino.LevelWithSilent;
  // Keep the test runner's output clean — the content-reader tests deliberately
  // feed malformed MDX, which would otherwise emit error JSON on every run.
  if (process.env.VITEST) return 'silent';
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

export const logger = pino({
  level: defaultLevel(),
  // Static personal site — no PII flows through these logs, but keep the base
  // bindings minimal (drop pid/hostname) so the JSON stays compact and the
  // build output isn't noisy with per-process churn.
  base: undefined,
});

/**
 * Report a caught error through both the structured logger and Sentry.
 *
 * Centralizes the "log it, then capture it" pattern the content readers use so
 * a malformed-MDX failure (or any caught exception) leaves BOTH a structured,
 * level-`error` JSON line in the log stream AND a Sentry event — instead of
 * only the Sentry event it left before #170. `context` becomes both the pino
 * log fields and the Sentry event tags, so `op` / `slug` correlate across the
 * two systems.
 */
export function reportError(error: unknown, context: Record<string, string> = {}): void {
  logger.error({ ...context, err: error }, 'caught exception');
  Sentry.captureException(error, { tags: context });
}
