import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { reportError } from './logger';

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  draft?: boolean;
  /**
   * Optional custom social-card image, as a `public/`-relative path
   * (e.g. `/blog/my-post/og.png`, ideally 1200×630). When set, the
   * per-post opengraph-image / twitter-image routes serve this file
   * instead of the generated title card.
   */
  ogImage?: string;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

async function readPostFile(filename: string): Promise<Post | null> {
  if (!filename.endsWith('.mdx')) return null;
  const slug = filename.replace(/\.mdx$/, '');
  const raw = await fs.readFile(path.join(POSTS_DIR, filename), 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;
  if (!frontmatter.title || !frontmatter.date || !frontmatter.excerpt) {
    throw new Error(`Post ${slug} is missing required frontmatter (title, date, excerpt)`);
  }
  return { slug, frontmatter, content };
}

export async function getAllPosts(): Promise<Post[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  // Per-file isolation: a single malformed file (bad YAML, missing required
  // frontmatter) is reported to Sentry and skipped rather than throwing out of
  // the map and collapsing the entire blog index / sitemap / RSS / llms.txt to
  // empty. See #153.
  const posts = await Promise.all(
    entries.map(async (filename) => {
      try {
        return await readPostFile(filename);
      } catch (err) {
        const slug = filename.replace(/\.mdx$/, '');
        reportError(err, { op: 'readPost', slug });
        return null;
      }
    }),
  );
  return posts
    .filter((p): p is Post => p !== null)
    .filter((p) => !p.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await readPostFile(`${slug}.mdx`);
    if (!post || post.frontmatter.draft) return null;
    return post;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    // Report the parse/read failure before returning the fallback so a
    // malformed post that 404s leaves an operator breadcrumb instead of
    // vanishing silently. See #153.
    reportError(err, { op: 'readPost', slug });
    return null;
  }
}

export function formatPostDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
