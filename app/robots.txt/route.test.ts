import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('GET /robots.txt', () => {
  it('serves text/plain with the documented cache-control header', () => {
    const res = GET();

    expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
  });

  it('emits an allow-all policy', async () => {
    const body = await GET().text();

    expect(body).toContain('User-Agent: *');
    expect(body).toContain('Allow: /');
    expect(body).not.toContain('Disallow:');
  });

  it('points Host and Sitemap at SITE_URL', async () => {
    const body = await GET().text();

    expect(body).toContain('Host: https://mattsears18.com');
    expect(body).toContain('Sitemap: https://mattsears18.com/sitemap.xml');
  });

  it('terminates the body with a trailing newline', async () => {
    const body = await GET().text();

    expect(body.endsWith('\n')).toBe(true);
  });
});
