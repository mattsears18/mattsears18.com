import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Post } from '@/lib/posts';

// Mock the data reader so the handler's serialization logic is exercised in
// isolation, mirroring the `lib/*.test.ts` pattern. `vi.mock` is hoisted above
// the import of the route module.
vi.mock('@/lib/posts', () => ({ getAllPosts: vi.fn() }));

import { getAllPosts } from '@/lib/posts';

import { GET } from './route';

const getAllPostsMock = vi.mocked(getAllPosts);

function makePost(slug: string, overrides: Partial<Post['frontmatter']> = {}): Post {
  return {
    slug,
    frontmatter: {
      title: `Title ${slug}`,
      date: '2024-03-15',
      excerpt: `Excerpt for ${slug}.`,
      ...overrides,
    },
    content: 'Body.',
  };
}

beforeEach(() => {
  getAllPostsMock.mockReset();
});

describe('GET /rss.xml', () => {
  it('serves RSS XML with the documented content-type and cache-control headers', async () => {
    getAllPostsMock.mockResolvedValue([makePost('hello')]);

    const res = await GET();

    expect(res.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
  });

  it('emits a well-formed RSS 2.0 feed envelope', async () => {
    getAllPostsMock.mockResolvedValue([makePost('hello')]);

    const body = await (await GET()).text();

    expect(body).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain('<title>Matt Sears</title>');
  });

  it('maps each post to an item with the absolute /blog/<slug> link, title, and description', async () => {
    getAllPostsMock.mockResolvedValue([
      makePost('first', { title: 'First Post', excerpt: 'First excerpt.' }),
      makePost('second', { title: 'Second Post', excerpt: 'Second excerpt.' }),
    ]);

    const body = await (await GET()).text();

    expect(body).toContain('https://mattsears18.com/blog/first');
    expect(body).toContain('First Post');
    expect(body).toContain('First excerpt.');
    expect(body).toContain('https://mattsears18.com/blog/second');
    expect(body).toContain('Second Post');
  });

  it('emits one <item> per post returned by the reader', async () => {
    getAllPostsMock.mockResolvedValue([makePost('a'), makePost('b'), makePost('c')]);

    const body = await (await GET()).text();

    expect((body.match(/<item>/g) ?? []).length).toBe(3);
  });

  it('parses the frontmatter date as UTC midnight (no off-by-one timezone drift)', async () => {
    getAllPostsMock.mockResolvedValue([makePost('dated', { date: '2024-03-15' })]);

    const body = await (await GET()).text();

    // `feed` renders pubDate in RFC-822; a `${date}T00:00:00Z` parse pins it to
    // 15 Mar 2024 00:00:00 GMT regardless of the host timezone.
    expect(body).toContain('15 Mar 2024 00:00:00 GMT');
  });

  it('emits a feed with no items when there are no posts', async () => {
    getAllPostsMock.mockResolvedValue([]);

    const body = await (await GET()).text();

    expect(body).toContain('<rss version="2.0"');
    expect((body.match(/<item>/g) ?? []).length).toBe(0);
  });
});
