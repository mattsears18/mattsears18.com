const createMDX = require('@next/mdx');
const createWithVercelToolbar = require('@vercel/toolbar/plugins/next');

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

module.exports = withVercelToolbar(withMDX(nextConfig));
