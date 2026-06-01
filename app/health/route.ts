/*
 * `/health` — liveness endpoint for uptime monitors, load balancers, and
 * container orchestration probes (Better Uptime, UptimeRobot, k8s, etc.).
 *
 * Returns `200 {"status":"ok"}` with no auth. The site is a static
 * portfolio with no database or external runtime dependency, so there is
 * nothing to ping here — the route's job is purely "is the server process
 * answering requests". A `timestamp` is included so a monitor can detect a
 * stale/cached response.
 *
 * Forced dynamic + `no-store` on purpose: a cached static health response
 * would keep reporting 200 from the CDN edge even if the origin were down,
 * which defeats the point of a liveness probe. See #169.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
