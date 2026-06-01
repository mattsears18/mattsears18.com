import { getAllPosts } from '@/lib/posts';
import { SITE_URL, STATIC_FEED_CACHE_CONTROL } from '@/lib/site';
import { getAllProjects } from '@/lib/work';

/*
 * `/sitemap.xml` — emitted by Next from this route handler at build time.
 *
 * Hand-rolled as a `Response`-returning route handler (rather than Next's
 * `MetadataRoute.Sitemap` convention) so it can declare the same explicit
 * `Cache-Control` window as the other build-time, agent-facing endpoints
 * (`/rss.xml`, `/llms.txt`). A `MetadataRoute` export can't set response
 * headers directly — see #157.
 *
 * Includes:
 *   - `/`             landing page              (changeFrequency: monthly)
 *   - `/blog`         blog index                (changeFrequency: weekly)
 *   - `/blog/:slug`   every published post      (lastModified = frontmatter date)
 *   - `/work`         portfolio index           (changeFrequency: monthly)
 *   - `/work/:slug`   every project detail page (changeFrequency: yearly)
 *   - `/privacy`      privacy notice            (changeFrequency: yearly)
 *
 * Project frontmatter has no `date` field — projects are evergreen — so we
 * use `now` for project lastModified. Acceptable: search engines mostly use
 * this for crawl scheduling, not freshness ranking, and the project pages
 * change infrequently.
 */
export const dynamic = 'force-static';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

function renderUrlEntry({ url, lastModified, changeFrequency, priority }: SitemapEntry): string {
  return [
    '  <url>',
    `    <loc>${url}</loc>`,
    `    <lastmod>${lastModified.toISOString()}</lastmod>`,
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    '  </url>',
  ].join('\n');
}

export async function GET() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const now = new Date();

  const staticRoutes: SitemapEntry[] = [
    {
      // No trailing slash — matches the canonical tag rendered by `app/page.tsx`
      // (Next.js resolves `alternates.canonical: '/'` against `metadataBase` and
      // drops the slash), the convention used by every other route on the site
      // (`/blog`, `/work`, `/blog/:slug`, `/work/:slug`), and `SITE_URL` itself.
      // See #70.
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0] ? new Date(`${posts[0].frontmatter.date}T00:00:00Z`) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const postRoutes: SitemapEntry[] = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.frontmatter.date}T00:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const projectRoutes: SitemapEntry[] = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const entries = [...staticRoutes, ...postRoutes, ...projectRoutes];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(renderUrlEntry),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': STATIC_FEED_CACHE_CONTROL,
    },
  });
}
