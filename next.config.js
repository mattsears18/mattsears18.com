const createMDX = require('@next/mdx');
const createWithVercelToolbar = require('@vercel/toolbar/plugins/next');
const { withSentryConfig } = require('@sentry/nextjs');

const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  keepBackground: false,
};

/*
 * Static defense-in-depth headers — see #38.
 *
 * The Content-Security-Policy header is NOT in this list: it carries a
 * per-request nonce and is set by `proxy.ts` instead. The four headers
 * below are static strings with no request-dependent data, so applying them
 * here keeps them off the proxy hot path (and lets them apply to routes
 * excluded from the proxy matcher — robots.txt, sitemap.xml, /_next/static,
 * etc.).
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
];

/*
 * CORS posture — see #40.
 *
 * HTML routes get NO Access-Control-Allow-Origin header. Browsers don't
 * enforce CORS on top-level HTML navigation anyway, so a wildcard ACAO on
 * HTML is at best meaningless and at worst a smell — it lets any origin
 * `fetch('/blog', { credentials: 'omit' })` and read the body cross-origin.
 * The site is fully public today, so the practical exploit surface is zero,
 * but locking it down now keeps the door closed when a future route gains
 * auth or returns anything user-specific.
 *
 * The truly-public asset surface (RSS feed, sitemap, robots, llms.txt) still
 * needs `Access-Control-Allow-Origin: *` because feed readers and AI agents
 * fetch them cross-origin from arbitrary domains. We make that explicit here
 * rather than relying on Vercel's per-route defaults so the behavior is
 * stable across platform changes.
 *
 * Static chunks under /_next/static/* keep ACAO too — the <link rel=preload
 * as=font crossorigin> tags Next.js emits in <head> trigger CORS-mode font
 * fetches that fail without it.
 */
const publicCorsHeader = { key: 'Access-Control-Allow-Origin', value: '*' };
const publicCorsRoutes = ['/rss.xml', '/sitemap.xml', '/robots.txt', '/llms.txt'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Pin the workspace root so Turbopack doesn't latch onto a stray
  // lockfile higher up the tree (happens when the repo is checked out
  // under a home directory that has its own yarn.lock / package-lock.json).
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Truly-public asset routes that legitimate cross-origin clients (feed
      // readers, AI agents, search crawlers) need to fetch directly.
      ...publicCorsRoutes.map((source) => ({
        source,
        headers: [publicCorsHeader],
      })),
      // Static chunks — fonts preloaded with `crossorigin=""` in <head> need
      // this for the CORS-mode fetch to succeed.
      {
        source: '/_next/static/:path*',
        headers: [publicCorsHeader],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-frontmatter', require.resolve('./lib/remark-strip-frontmatter')],
    rehypePlugins: [['rehype-pretty-code', rehypePrettyCodeOptions]],
  },
});

const withVercelToolbar = createWithVercelToolbar();

/*
 * Sentry wrapping — see #43.
 *
 * `withSentryConfig` wires the SDK's webpack plugin in so source maps
 * upload at build time (requires SENTRY_AUTH_TOKEN — set in Vercel env)
 * and instruments route handlers / Server Components automatically. It
 * MUST be the outermost wrapper so the plugin sees the final config.
 *
 * Options kept minimal: `silent` mutes the plugin's build-log noise
 * locally (CI still gets full output). Auth token and org/project
 * come from env so a fork-clone build doesn't try to push source
 * maps to a Sentry project it can't auth against.
 */
const sentryOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
};

module.exports = withSentryConfig(withVercelToolbar(withMDX(nextConfig)), sentryOptions);
