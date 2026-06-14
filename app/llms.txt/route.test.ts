import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Post } from '@/lib/posts';
import type { Project } from '@/lib/work';

vi.mock('@/lib/posts', () => ({ getAllPosts: vi.fn() }));
vi.mock('@/lib/work', () => ({ getAllProjects: vi.fn() }));

import { getAllPosts } from '@/lib/posts';
import { getAllProjects } from '@/lib/work';

import { GET } from './route';

const getAllPostsMock = vi.mocked(getAllPosts);
const getAllProjectsMock = vi.mocked(getAllProjects);

function makePost(slug: string): Post {
  return {
    slug,
    frontmatter: {
      title: `Post ${slug}`,
      date: '2024-03-15',
      excerpt: `Excerpt ${slug}.`,
    },
    content: 'Body.',
  };
}

function makeProject(slug: string): Project {
  return {
    slug,
    frontmatter: {
      title: `Project ${slug}`,
      role: 'Eng',
      year: '2024',
      summary: `Summary ${slug}.`,
      tech: ['ts'],
    },
    content: 'Body.',
  };
}

beforeEach(() => {
  getAllPostsMock.mockReset();
  getAllProjectsMock.mockReset();
});

describe('GET /llms.txt', () => {
  it('serves text/plain with the documented cache-control header', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const res = await GET();

    expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
  });

  it('emits the llmstxt.org header (# title + > tagline)', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('# Matt Sears');
    expect(body).toContain('> Product engineer building developer tools.');
  });

  it('builds absolute URLs from relative hrefs via bullet()', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    // Static portfolio links are relative hrefs that bullet() should absolutize.
    expect(body).toContain('[Home](https://mattsears18.com/)');
    expect(body).toContain('[Work](https://mattsears18.com/work)');
    expect(body).toContain('[Blog](https://mattsears18.com/blog)');
  });

  it('leaves already-absolute hrefs untouched (no double prefix)', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).not.toContain('https://mattsears18.comhttps://');
  });

  it('caps the Projects section at PROJECTS_LIMIT (6) entries', async () => {
    getAllProjectsMock.mockResolvedValue(
      Array.from({ length: 10 }, (_, i) => makeProject(`p${i}`)),
    );
    getAllPostsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('/work/p0');
    expect(body).toContain('/work/p5');
    expect(body).not.toContain('/work/p6');
  });

  it('caps the Recent posts section at POSTS_LIMIT (10) entries', async () => {
    getAllPostsMock.mockResolvedValue(Array.from({ length: 15 }, (_, i) => makePost(`b${i}`)));
    getAllProjectsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('/blog/b0');
    expect(body).toContain('/blog/b9');
    expect(body).not.toContain('/blog/b10');
  });

  it('renders Projects and Recent posts sections when their lists are non-empty', async () => {
    getAllProjectsMock.mockResolvedValue([makeProject('only')]);
    getAllPostsMock.mockResolvedValue([makePost('only')]);

    const body = await (await GET()).text();

    expect(body).toContain('## Projects');
    expect(body).toContain('## Recent posts');
    expect(body).toContain('[Project only](https://mattsears18.com/work/only): Summary only.');
    expect(body).toContain('[Post only](https://mattsears18.com/blog/only): Excerpt only.');
  });

  it('omits the Projects section when there are no projects', async () => {
    getAllProjectsMock.mockResolvedValue([]);
    getAllPostsMock.mockResolvedValue([makePost('only')]);

    const body = await (await GET()).text();

    expect(body).not.toContain('## Projects');
    expect(body).toContain('## Recent posts');
  });

  it('omits the Recent posts section when there are no posts', async () => {
    getAllProjectsMock.mockResolvedValue([makeProject('only')]);
    getAllPostsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('## Projects');
    expect(body).not.toContain('## Recent posts');
  });

  it('always emits the Feeds section pointing at the sibling endpoints', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('## Feeds');
    expect(body).toContain('[RSS feed](https://mattsears18.com/rss.xml)');
    expect(body).toContain('[Sitemap](https://mattsears18.com/sitemap.xml)');
  });
});
