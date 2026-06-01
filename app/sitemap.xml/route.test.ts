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

/** Pull every <loc> URL out of the sitemap XML body. */
function extractLocs(body: string): string[] {
  const locs: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    locs.push(match[1]);
  }
  return locs;
}

beforeEach(() => {
  getAllPostsMock.mockReset();
  getAllProjectsMock.mockReset();
});

describe('GET /sitemap.xml', () => {
  it('serves sitemap XML with the documented content-type and cache-control headers', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const res = await GET();

    expect(res.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
  });

  it('emits a well-formed urlset envelope', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(body.trimEnd()).toMatch(/<\/urlset>$/);
  });

  it('includes the four static routes', async () => {
    getAllPostsMock.mockResolvedValue([]);
    getAllProjectsMock.mockResolvedValue([]);

    const locs = extractLocs(await (await GET()).text());

    expect(locs).toContain('https://mattsears18.com');
    expect(locs).toContain('https://mattsears18.com/blog');
    expect(locs).toContain('https://mattsears18.com/work');
    expect(locs).toContain('https://mattsears18.com/privacy');
  });

  it('emits one entry per post and per project', async () => {
    getAllPostsMock.mockResolvedValue([makePost('p1'), makePost('p2')]);
    getAllProjectsMock.mockResolvedValue([makeProject('w1')]);

    const locs = extractLocs(await (await GET()).text());

    expect(locs).toContain('https://mattsears18.com/blog/p1');
    expect(locs).toContain('https://mattsears18.com/blog/p2');
    expect(locs).toContain('https://mattsears18.com/work/w1');
    // 4 static + 2 posts + 1 project
    expect(locs.length).toBe(7);
  });

  it('emits lastmod, changefreq, and priority for every entry', async () => {
    getAllPostsMock.mockResolvedValue([makePost('p1')]);
    getAllProjectsMock.mockResolvedValue([makeProject('w1')]);

    const body = await (await GET()).text();

    // One <url> block per entry; each carries all four child tags.
    const urlBlocks = (body.match(/<url>/g) ?? []).length;
    expect(urlBlocks).toBe(6);
    expect((body.match(/<lastmod>/g) ?? []).length).toBe(6);
    expect((body.match(/<changefreq>/g) ?? []).length).toBe(6);
    expect((body.match(/<priority>/g) ?? []).length).toBe(6);
    // priority is rendered with a single decimal place.
    expect(body).toContain('<priority>1.0</priority>');
  });

  it('uses the frontmatter date (UTC midnight) for post lastmod', async () => {
    getAllPostsMock.mockResolvedValue([makePost('dated')]);
    getAllProjectsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('<lastmod>2024-03-15T00:00:00.000Z</lastmod>');
  });

  it('emits no trailing slash on any URL (regression guard for #70)', async () => {
    getAllPostsMock.mockResolvedValue([makePost('p1')]);
    getAllProjectsMock.mockResolvedValue([makeProject('w1')]);

    const locs = extractLocs(await (await GET()).text());

    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) {
      expect(loc.endsWith('/')).toBe(false);
    }
    // The canonical root is the bare origin, not `https://.../`.
    expect(locs).toContain('https://mattsears18.com');
    expect(locs).not.toContain('https://mattsears18.com/');
  });
});
