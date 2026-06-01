import { describe, expect, it } from 'vitest';

import {
  breadcrumbListSchema,
  creativeWorkSchema,
  personSchema,
  websiteSchema,
  type CreativeWorkInput,
} from '@/lib/json-ld';
import { SITE_TITLE, SITE_URL } from '@/lib/site';

// These builders are pure, deterministic functions whose output is never
// visually rendered — it's serialized into a `<script type="application/ld+json">`
// tag for Google's Rich Results. A dropped or mis-mapped field would silently
// degrade structured data with nothing to catch it, so each test asserts the
// FULL object shape via `toEqual` (not a subset match) — adding or removing a
// field fails the test on purpose. See issue #178.

describe('personSchema', () => {
  it('returns the canonical Person object sourced from SITE constants', () => {
    expect(personSchema()).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: SITE_TITLE,
      url: SITE_URL,
      jobTitle: 'Lead Software Engineer',
      sameAs: ['https://github.com/mattsears18', 'https://www.linkedin.com/in/mattsears18/'],
    });
  });
});

describe('websiteSchema', () => {
  it('returns the WebSite object with no potentialAction (no on-site search)', () => {
    expect(websiteSchema()).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_TITLE,
      url: SITE_URL,
      inLanguage: 'en-US',
    });
  });
});

describe('breadcrumbListSchema', () => {
  it('maps each crumb to an ordered ListItem with an absolutized url', () => {
    expect(
      breadcrumbListSchema([
        { name: 'Home', path: '/' },
        { name: 'Work', path: '/work' },
        { name: 'Express Delphi', path: '/work/express-delphi' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Work',
          item: `${SITE_URL}/work`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Express Delphi',
          item: `${SITE_URL}/work/express-delphi`,
        },
      ],
    });
  });

  it('produces an empty itemListElement for an empty crumb list', () => {
    expect(breadcrumbListSchema([])).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    });
  });

  it('numbers positions from 1 in array order', () => {
    const result = breadcrumbListSchema([
      { name: 'A', path: '/a' },
      { name: 'B', path: '/b' },
    ]);
    expect(result.itemListElement.map((entry) => entry.position)).toEqual([1, 2]);
  });
});

describe('creativeWorkSchema', () => {
  const baseProject: CreativeWorkInput = {
    title: 'Express Delphi',
    summary: 'A facilitated estimation tool for rapid expert consensus.',
    slug: 'express-delphi',
    tech: ['TypeScript', 'Next.js', 'PostgreSQL'],
    year: '2024',
  };

  it('maps frontmatter fields into the CreativeWork shape (no links)', () => {
    expect(creativeWorkSchema(baseProject)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Express Delphi',
      description: 'A facilitated estimation tool for rapid expert consensus.',
      url: `${SITE_URL}/work/express-delphi`,
      keywords: 'TypeScript, Next.js, PostgreSQL',
      dateCreated: '2024',
      author: { '@type': 'Person', name: SITE_TITLE, url: SITE_URL },
      inLanguage: 'en-US',
    });
  });

  it('omits sameAs entirely when there are no links', () => {
    expect(creativeWorkSchema(baseProject)).not.toHaveProperty('sameAs');
  });

  it('surfaces http(s) links as sameAs when present', () => {
    const result = creativeWorkSchema({
      ...baseProject,
      links: ['https://example.com', 'https://github.com/mattsears18/express-delphi'],
    });
    expect(result).toHaveProperty('sameAs', [
      'https://example.com',
      'https://github.com/mattsears18/express-delphi',
    ]);
  });

  it('filters out non-http links and omits sameAs when none qualify', () => {
    const result = creativeWorkSchema({
      ...baseProject,
      links: ['mailto:matt@example.com', '/relative/path'],
    });
    expect(result).not.toHaveProperty('sameAs');
  });

  it('keeps only http(s) entries from a mixed link list', () => {
    const result = creativeWorkSchema({
      ...baseProject,
      links: ['mailto:matt@example.com', 'https://example.com', '/relative'],
    });
    expect(result).toHaveProperty('sameAs', ['https://example.com']);
  });

  it('joins the tech array into a comma-separated keywords string', () => {
    expect(creativeWorkSchema({ ...baseProject, tech: ['Swift'] }).keywords).toBe('Swift');
    expect(creativeWorkSchema({ ...baseProject, tech: [] }).keywords).toBe('');
  });
});
