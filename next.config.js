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
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      require.resolve('./lib/remark-strip-frontmatter'),
    ],
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
