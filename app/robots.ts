import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/*
 * `/robots.txt` — emitted by Next from this file at build time.
 *
 * Allow-all policy with a pointer to the sitemap. We aren't disallowing
 * anything because there's nothing on the site that shouldn't be indexed —
 * if a private route ever lands, list it under `disallow` here.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
