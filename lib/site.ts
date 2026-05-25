/**
 * Site-wide constants. Keep the source of truth in one place so metadata,
 * sitemap, robots, and feed generators all agree on the canonical URL and
 * branding strings.
 */
export const SITE_URL = 'https://mattsears18.com';
export const SITE_TITLE = 'Matt Sears';
export const SITE_DESCRIPTION =
  'Matt Sears — software engineer with a civil engineering PhD. Lead engineer at SalesRiver, board member at Enrich, and builder of Shipyard and Lightwork on the side.';
export const SITE_TAGLINE = 'Software engineer with a civil engineering PhD.';

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
