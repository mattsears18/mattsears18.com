import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let tmpDir: string;
const realCwd = process.cwd.bind(process);

async function writePost(slug: string, frontmatter: Record<string, unknown>, body = 'Body.') {
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
  await fs.writeFile(
    path.join(tmpDir, 'content', 'posts', `${slug}.mdx`),
    `---\n${yaml}\n---\n${body}\n`,
    'utf8',
  );
}

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'posts-test-'));
  await fs.mkdir(path.join(tmpDir, 'content', 'posts'), { recursive: true });
  vi.spyOn(process, 'cwd').mockReturnValue(tmpDir);
  vi.resetModules();
});

afterEach(async () => {
  vi.restoreAllMocks();
  await fs.rm(tmpDir, { recursive: true, force: true });
  process.cwd = realCwd;
});

describe('getAllPosts', () => {
  it('returns posts sorted newest-first by date', async () => {
    await writePost('older', { title: 'Older', date: '2024-01-01', excerpt: 'o' });
    await writePost('newer', { title: 'Newer', date: '2025-06-15', excerpt: 'n' });
    await writePost('middle', { title: 'Middle', date: '2024-09-01', excerpt: 'm' });

    const { getAllPosts } = await import('./posts');
    const posts = await getAllPosts();

    expect(posts.map((p) => p.slug)).toEqual(['newer', 'middle', 'older']);
  });

  it('filters out posts marked draft: true', async () => {
    await writePost('published', { title: 'Pub', date: '2025-01-01', excerpt: 'e' });
    await writePost('hidden', { title: 'Hid', date: '2025-02-01', excerpt: 'e', draft: true });

    const { getAllPosts } = await import('./posts');
    const posts = await getAllPosts();

    expect(posts.map((p) => p.slug)).toEqual(['published']);
  });

  it('ignores non-mdx files in the posts directory', async () => {
    await writePost('real', { title: 'R', date: '2025-01-01', excerpt: 'e' });
    await fs.writeFile(path.join(tmpDir, 'content', 'posts', 'README.md'), '# notes\n', 'utf8');
    await fs.writeFile(path.join(tmpDir, 'content', 'posts', '.DS_Store'), '', 'utf8');

    const { getAllPosts } = await import('./posts');
    const posts = await getAllPosts();

    expect(posts.map((p) => p.slug)).toEqual(['real']);
  });

  it('returns an empty array when the posts directory does not exist', async () => {
    await fs.rm(path.join(tmpDir, 'content', 'posts'), { recursive: true });

    const { getAllPosts } = await import('./posts');
    const posts = await getAllPosts();

    expect(posts).toEqual([]);
  });

  it('throws with the slug in the error when required frontmatter is missing', async () => {
    await writePost('incomplete', { title: 'Only title' });

    const { getAllPosts } = await import('./posts');

    await expect(getAllPosts()).rejects.toThrow(/incomplete/);
  });
});

describe('getPostBySlug', () => {
  it('returns the post when the slug matches a published file', async () => {
    await writePost('hello', { title: 'Hello', date: '2025-01-01', excerpt: 'hi' });

    const { getPostBySlug } = await import('./posts');
    const post = await getPostBySlug('hello');

    expect(post).not.toBeNull();
    expect(post?.frontmatter.title).toBe('Hello');
  });

  it('returns null when the slug does not exist', async () => {
    const { getPostBySlug } = await import('./posts');
    const post = await getPostBySlug('does-not-exist');

    expect(post).toBeNull();
  });

  it('returns null when the post is marked draft: true', async () => {
    await writePost('wip', { title: 'WIP', date: '2025-01-01', excerpt: 'e', draft: true });

    const { getPostBySlug } = await import('./posts');
    const post = await getPostBySlug('wip');

    expect(post).toBeNull();
  });
});

describe('formatPostDate', () => {
  it('formats an ISO date as "Month Day, Year" in en-US / UTC', async () => {
    const { formatPostDate } = await import('./posts');
    expect(formatPostDate('2024-03-15')).toBe('March 15, 2024');
  });

  it('does not drift across timezones (uses UTC explicitly)', async () => {
    const { formatPostDate } = await import('./posts');
    expect(formatPostDate('2024-01-01')).toBe('January 1, 2024');
    expect(formatPostDate('2024-12-31')).toBe('December 31, 2024');
  });
});
