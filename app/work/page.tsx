import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/app/components/json-ld';
import { ProjectImage } from '@/app/components/project-image';
import { breadcrumbListSchema } from '@/lib/json-ld';
import { defaultOpenGraph } from '@/lib/site';
import { formatLinkLabel, getAllProjects } from '@/lib/work';

const WORK_DESCRIPTION =
  'Selected projects — shipped systems, research tools, and side projects across a decade of building.';

export const metadata: Metadata = {
  title: 'Work',
  description: WORK_DESCRIPTION,
  alternates: { canonical: '/work' },
  openGraph: {
    ...defaultOpenGraph,
    title: 'Work — Matt Sears',
    description: WORK_DESCRIPTION,
    url: '/work',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work — Matt Sears',
    description: WORK_DESCRIPTION,
  },
};

/**
 * `/work` — portfolio index.
 *
 * Layout follows design.md §Work: list-style index, each project = title +
 * 1-line role + 2–3 stack badges + summary. Featured projects lead (see
 * `getAllProjects` sort order); within each tier sort is by recency.
 *
 * Every card links to its detail page at `/work/<slug>` — case-study depth
 * is the MDX body, rendered by `app/work/[slug]/page.tsx`.
 *
 * `links` from frontmatter render as a small row of secondary actions on
 * the card so a visitor can hop directly to the live site / repo / paper
 * without an extra click through the detail page.
 */
export default async function WorkIndexPage() {
  const projects = await getAllProjects();

  return (
    <div className="py-16 sm:py-20">
      <JsonLd
        schema={breadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
        ])}
      />
      <header className="mb-12 max-w-reading sm:mb-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-muted">
          Selected work
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Work
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fg-muted">
          A shortlist of projects from research, industry, and the side-project shelf — chosen for
          breadth of stack and depth of outcome, not for completeness.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-fg-muted">
          Nothing here yet.{' '}
          <Link href="/" className="text-accent underline-offset-4 hover:underline">
            Back home →
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {projects.map((project) => {
            const { slug, frontmatter } = project;
            const links = frontmatter.links ?? {};
            return (
              <li key={slug} className="py-10 sm:py-12">
                {/*
                 * Single-link card pattern (a11y, issue #74): only the title
                 * `<Link>` is in the accessibility tree / Tab order. It covers
                 * the entire card via a `::before` overlay (`before:absolute
                 * before:inset-0`), so sighted mouse users can still click the
                 * image to navigate, but screen-reader and keyboard users get
                 * exactly one stop per card. External links in the right
                 * column carry `relative z-10` so they stay clickable above
                 * the overlay.
                 */}
                <article className="group relative grid gap-6 sm:grid-cols-[1fr_2fr] sm:gap-10">
                  <div className="space-y-4">
                    <ProjectImage
                      project={project}
                      variant="card"
                      className="transition-opacity group-hover:opacity-90"
                    />
                    <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
                      <span>{frontmatter.role}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{frontmatter.year}</span>
                    </p>
                  </div>

                  <div className="max-w-reading">
                    <h2 className="font-display text-2xl font-medium tracking-tight text-fg sm:text-3xl">
                      <Link
                        href={`/work/${slug}`}
                        className="inline-flex items-baseline gap-2 before:absolute before:inset-0 before:content-[''] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
                      >
                        <span>{frontmatter.title}</span>
                        <span
                          aria-hidden="true"
                          className="text-base text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                        >
                          →
                        </span>
                      </Link>
                    </h2>

                    <p className="mt-3 text-base leading-relaxed text-fg-muted">
                      {frontmatter.summary}
                    </p>

                    <ul aria-label="Technology stack" className="mt-5 flex flex-wrap gap-2">
                      {frontmatter.tech.map((tech) => (
                        <li
                          key={tech}
                          className="rounded border border-border px-2 py-1 font-mono text-xs text-fg-muted"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    {Object.keys(links).length > 0 ? (
                      <p className="relative z-10 mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-widest">
                        {Object.entries(links).map(([key, href]) => (
                          <a
                            key={key}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-accent underline-offset-4 hover:underline"
                          >
                            {formatLinkLabel(key)} ↗
                          </a>
                        ))}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
