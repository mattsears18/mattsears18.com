import { Feed } from 'feed';

import { getAllPosts } from '@/lib/posts';

const SITE_URL = 'https://mattsears18.com';
const SITE_TITLE = 'Matt Sears';
const SITE_DESCRIPTION = 'Building software, writing about it, occasionally arguing with it.';

export const dynamic = 'force-static';

export async function GET() {
  const posts = await getAllPosts();

  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: 'en-US',
    feedLinks: {
      rss: `${SITE_URL}/rss.xml`,
    },
    copyright: `© ${new Date().getFullYear()} Matt Sears`,
  });

  for (const post of posts) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    feed.addItem({
      title: post.frontmatter.title,
      id: url,
      link: url,
      description: post.frontmatter.excerpt,
      date: new Date(`${post.frontmatter.date}T00:00:00Z`),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
