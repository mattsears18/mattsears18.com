/**
 * Site-wide constants. Keep the source of truth in one place so metadata,
 * sitemap, robots, and feed generators all agree on the canonical URL and
 * branding strings.
 */
export const SITE_URL = 'https://mattsears18.com';
export const SITE_TITLE = 'Matt Sears';
export const SITE_DESCRIPTION =
  'Matt Sears — software engineer with a civil engineering PhD. Lead at SalesRiver, board member at Enrich, building Shipyard and Lightwork on the side.';
export const SITE_TAGLINE = 'Software engineer with a civil engineering PhD.';

/**
 * Shared `Cache-Control` policy for the build-time, crawler/agent-facing
 * endpoints (`/rss.xml`, `/llms.txt`, `/sitemap.xml`, `/robots.txt`). All four
 * are `force-static` and regenerate from the same `getAllPosts()` /
 * `getAllProjects()` source on every build, so they should declare an
 * identical one-hour CDN/browser freshness window rather than letting some
 * fall back to a framework default. Declared once here so the window can't
 * drift across siblings (see #157).
 */
export const STATIC_FEED_CACHE_CONTROL = 'public, max-age=3600, s-maxage=3600';

/**
 * Default Open Graph fields that must appear on every route. The Next.js
 * App Router does NOT shallow-merge `openGraph` objects across the layout/
 * page boundary — a page-level `openGraph` block replaces the root layout's
 * `openGraph` entirely, dropping `siteName` / `locale` / etc. (see #68).
 *
 * Spread this constant into every page-level `openGraph` so the site-wide
 * fields are preserved alongside route-specific overrides:
 *
 *   openGraph: {
 *     ...defaultOpenGraph,
 *     title: 'Post title',
 *     ...
 *   }
 */
export const defaultOpenGraph = {
  siteName: SITE_TITLE,
  locale: 'en_US',
} as const;
