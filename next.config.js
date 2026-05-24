const createMDX = require('@next/mdx');
const createWithVercelToolbar = require('@vercel/toolbar/plugins/next');

const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  keepBackground: false,
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Pin the workspace root so Turbopack doesn't latch onto a stray
  // lockfile higher up the tree (happens when the repo is checked out
  // under a home directory that has its own yarn.lock / package-lock.json).
  turbopack: {
    root: __dirname,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [['rehype-pretty-code', rehypePrettyCodeOptions]],
  },
});

const withVercelToolbar = createWithVercelToolbar();

module.exports = withVercelToolbar(withMDX(nextConfig));
