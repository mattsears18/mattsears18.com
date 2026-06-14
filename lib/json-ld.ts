/**
 * Schema.org JSON-LD generators — Person, WebSite, BreadcrumbList.
 *
 * These functions return plain JS objects that the `<JsonLd>` component
 * (`app/components/json-ld.tsx`) serializes into a `<script type="application/ld+json">`
 * tag. Keeping the shapes here (instead of inlining in pages) makes the
 * schema.org compliance reviewable in one place and lets pages compose
 * BreadcrumbList items without re-deriving the URL conventions.
 *
 * Conformance reference: https://schema.org/Person, /WebSite, /BreadcrumbList
 * Validation: paste the rendered JSON into Google's Rich Results Test
 * (https://search.google.com/test/rich-results) before declaring victory.
 */
import { SITE_TITLE, SITE_URL } from '@/lib/site';

/**
 * The canonical Person schema for Matt — used in the site-wide root layout.
 *
 * `jobTitle` mirrors how he describes himself across the site ("product
 * engineer," the through-line of the home page). `sameAs` lists the public profile URLs
 * Google uses to disambiguate the Knowledge Panel entity; keep it tight
 * (GitHub + LinkedIn) — adding throwaway profiles dilutes the signal.
 */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_TITLE,
    url: SITE_URL,
    jobTitle: 'Product Engineer',
    sameAs: ['https://github.com/mattsears18', 'https://www.linkedin.com/in/mattsears18/'],
  } as const;
}

/**
 * WebSite schema — used in the site-wide root layout.
 *
 * No `potentialAction` (sitelinks search) because the site has no on-site
 * search endpoint to wire to. Adding a fake one would mislead Google's
 * sitelinks-search-box rendering and produce a broken result.
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_TITLE,
    url: SITE_URL,
    inLanguage: 'en-US',
  } as const;
}

/**
 * BreadcrumbList schema — one per page, reflecting the page's depth.
 *
 * `items` is an ordered array of `{ name, url }` pairs from the root crumb
 * (Home) down to the current page. The current page itself IS included as
 * the final item — Google's docs require the full chain to land the
 * breadcrumb rich result.
 *
 * URLs are absolutized against `SITE_URL` because schema.org's BreadcrumbList
 * requires absolute IRIs (relative URLs validate but don't render in Rich
 * Results in practice).
 */
export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  } as const;
}

/**
 * CreativeWork schema — one per `/work/<slug>` project detail page.
 *
 * Describes the project itself as a discrete structured entity authored by
 * Matt, so Google's Knowledge Graph treats each portfolio item as a creator's
 * work rather than an opaque webpage. Every field is sourced from the project's
 * MDX frontmatter (title/summary/tech/year) or the route slug — no
 * request-derived input, matching the safety contract in `<JsonLd>`.
 *
 * `keywords` is the comma-joined tech stack (schema.org's documented shape for
 * a keyword list on CreativeWork). `dateCreated` carries the project's
 * end-year so the entity is temporally anchored; `url` is absolutized against
 * `SITE_URL` for the same reason BreadcrumbList items are. When the project
 * frontmatter exposes outbound links (live site / repo / paper), they're
 * surfaced as `sameAs` to help disambiguate the entity — omitted entirely when
 * there are none rather than emitting an empty array.
 */
export type CreativeWorkInput = {
  title: string;
  summary: string;
  slug: string;
  tech: string[];
  year: string;
  /** Outbound project URLs (live site, repo, paper, …) — used as `sameAs`. */
  links?: string[];
};

export function creativeWorkSchema(project: CreativeWorkInput) {
  const sameAs = (project.links ?? []).filter((url) => url.startsWith('http'));
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/work/${project.slug}`,
    keywords: project.tech.join(', '),
    dateCreated: project.year,
    author: { '@type': 'Person', name: SITE_TITLE, url: SITE_URL },
    inLanguage: 'en-US',
    ...(sameAs.length > 0 ? { sameAs } : {}),
  } as const;
}

/**
 * Article schema — one per `/blog/<slug>` post detail page.
 *
 * Qualifies blog posts for Google's Article rich result (headline +
 * datePublished + author), so SERP entries can render as enhanced cards
 * rather than plain blue links. Every field is sourced from the post's MDX
 * frontmatter (title/date/excerpt) or the route slug — no request-derived
 * input, matching the safety contract documented in `<JsonLd>`.
 *
 * `headline` carries the post title; `datePublished` is the frontmatter
 * `date` (kept verbatim — it's already an ISO-ish date string Google
 * accepts). `url` is absolutized against `SITE_URL` for the same reason
 * BreadcrumbList items and CreativeWork URLs are. Both `author` and
 * `publisher` resolve to Matt as a single-author personal site (mirroring
 * `creativeWorkSchema`'s `author` shape). No `image` field is emitted —
 * post frontmatter has no image source (`PostFrontmatter` exposes only
 * title/date/excerpt/tags/draft), and fabricating one would mislead the
 * Rich Results validator; `image` is recommended, not required, for the
 * Article rich result.
 */
export type ArticleInput = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
};

export function articleSchema(post: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Person', name: SITE_TITLE, url: SITE_URL },
    publisher: { '@type': 'Person', name: SITE_TITLE, url: SITE_URL },
    inLanguage: 'en-US',
  } as const;
}
