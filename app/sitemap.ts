import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';
import { getAllProjects } from '@/lib/work';

/*
 * `/sitemap.xml` — emitted by Next from this file at build time.
 *
 * Includes:
 *   - `/`             landing page              (changeFrequency: monthly)
 *   - `/blog`         blog index                (changeFrequency: weekly)
 *   - `/blog/:slug`   every published post      (lastModified = frontmatter date)
 *   - `/work`         portfolio index           (changeFrequency: monthly)
 *   - `/work/:slug`   every project detail page (changeFrequency: yearly)
 *
 * Project frontmatter has no `date` field — projects are evergreen — so we
 * use `now` for project lastModified. Acceptable: search engines mostly use
 * this for crawl scheduling, not freshness ranking, and the project pages
 * change infrequently.
 */
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
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
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.frontmatter.date}T00:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
