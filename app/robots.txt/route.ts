import { SITE_URL, STATIC_FEED_CACHE_CONTROL } from '@/lib/site';

/*
 * `/robots.txt` — emitted by Next from this route handler at build time.
 *
 * Hand-rolled as a `Response`-returning route handler (rather than Next's
 * `MetadataRoute.Robots` convention) so it can declare the same explicit
 * `Cache-Control` window as the other build-time, agent-facing endpoints
 * (`/rss.xml`, `/llms.txt`, `/sitemap.xml`). A `MetadataRoute` export can't
 * set response headers directly — see #157.
 *
 * Allow-all policy with a pointer to the sitemap. We aren't disallowing
 * anything because there's nothing on the site that shouldn't be indexed —
 * if a private route ever lands, add a `Disallow:` line here.
 */
export const dynamic = 'force-static';

export function GET() {
  const body =
    ['User-Agent: *', 'Allow: /', '', `Host: ${SITE_URL}`, `Sitemap: ${SITE_URL}/sitemap.xml`].join(
      '\n',
    ) + '\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': STATIC_FEED_CACHE_CONTROL,
    },
  });
}
