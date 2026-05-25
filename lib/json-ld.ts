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
 * `jobTitle` mirrors how he describes himself across the site (lead engineer,
 * not generic "Software Engineer"). `sameAs` lists the public profile URLs
 * Google uses to disambiguate the Knowledge Panel entity; keep it tight
 * (GitHub + LinkedIn) — adding throwaway profiles dilutes the signal.
 */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_TITLE,
    url: SITE_URL,
    jobTitle: 'Lead Software Engineer',
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
