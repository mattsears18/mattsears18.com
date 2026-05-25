import { getAllPosts } from '@/lib/posts';
import { SITE_TAGLINE, SITE_TITLE, SITE_URL } from '@/lib/site';
import { getAllProjects } from '@/lib/work';

/*
 * `/llms.txt` — emitted by Next from this route at build time.
 *
 * Implements the convention at https://llmstxt.org/: a markdown document
 * that lets AI agents and LLM-powered browsers (Perplexity, ChatGPT Browse,
 * Claude with web access) discover the site's structure without having to
 * crawl every URL. Format:
 *
 *   # <Site title>
 *   > <One-line summary>
 *
 *   ## Section
 *   - [Link title](/url): one-line description.
 *
 * Source-of-truth is shared with `app/sitemap.ts` and `app/rss.xml/route.ts`
 * — same `getAllPosts()` / `getAllProjects()` / `SITE_*` constants — so a
 * new project or post lands in `/llms.txt` automatically on the next build.
 * No separate manifest to keep in sync.
 *
 * Served as `text/plain; charset=utf-8` per the convention (the file is
 * markdown by content but intended for direct ingestion by agents, not
 * rendering in a browser). See #63.
 */
export const dynamic = 'force-static';

const PROJECTS_LIMIT = 6;
const POSTS_LIMIT = 10;

function bullet(href: string, label: string, description?: string): string {
  const url = href.startsWith('http') ? href : `${SITE_URL}${href}`;
  const tail = description ? `: ${description}` : '';
  return `- [${label}](${url})${tail}`;
}

export async function GET() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

  // Featured first (matches the homepage / `/work` ordering), then the rest,
  // capped to keep the file scannable. `getAllProjects()` already returns
  // featured-first by year, so we just slice.
  const topProjects = projects.slice(0, PROJECTS_LIMIT);
  const recentPosts = posts.slice(0, POSTS_LIMIT);

  const lines: string[] = [];

  lines.push(`# ${SITE_TITLE}`);
  lines.push('');
  lines.push(
    `> ${SITE_TAGLINE} Lead engineer at SalesRiver, board member at Enrich, and builder of Shipyard and Lightwork on the side.`,
  );
  lines.push('');

  lines.push('## Portfolio');
  lines.push('');
  lines.push(bullet('/', 'Home', 'Bio and pointers to recent work.'));
  lines.push(bullet('/work', 'Work', 'Selected projects across a decade of building software.'));
  lines.push(
    bullet('/blog', 'Blog', 'Writing on software engineering and engineering leadership.'),
  );
  lines.push('');

  if (topProjects.length > 0) {
    lines.push('## Projects');
    lines.push('');
    for (const project of topProjects) {
      lines.push(
        bullet(`/work/${project.slug}`, project.frontmatter.title, project.frontmatter.summary),
      );
    }
    lines.push('');
  }

  if (recentPosts.length > 0) {
    lines.push('## Recent posts');
    lines.push('');
    for (const post of recentPosts) {
      lines.push(bullet(`/blog/${post.slug}`, post.frontmatter.title, post.frontmatter.excerpt));
    }
    lines.push('');
  }

  lines.push('## Feeds');
  lines.push('');
  lines.push(bullet('/rss.xml', 'RSS feed', 'New posts in RSS 2.0.'));
  lines.push(bullet('/sitemap.xml', 'Sitemap', 'Every indexable URL on the site.'));
  lines.push('');

  const body = lines.join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
