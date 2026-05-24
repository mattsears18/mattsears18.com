import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';

/*
 * `/sitemap.xml` — emitted by Next from this file at build time.
 *
 * Includes:
 *   - `/`        landing page                     (changeFrequency: monthly)
 *   - `/blog`    blog index                       (changeFrequency: weekly)
 *   - `/blog/:slug` every published post          (lastModified = frontmatter date)
 *
 * `/work` is intentionally absent — the route doesn't exist yet (issue #9).
 * Add it here when that slice ships.
 */
export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
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
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.frontmatter.date}T00:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
