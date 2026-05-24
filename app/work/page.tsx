import type { Metadata } from 'next';
import Link from 'next/link';

import { ProjectImage } from '@/app/components/project-image';
import { formatLinkLabel, getAllProjects } from '@/lib/work';

const WORK_DESCRIPTION =
  'Selected projects — shipped systems, research tools, and side projects across a decade of building.';

export const metadata: Metadata = {
  title: 'Work',
  description: WORK_DESCRIPTION,
  alternates: { canonical: '/work' },
  openGraph: {
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
      <header className="mb-12 max-w-reading sm:mb-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-muted">
          Selected work
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Work
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fg-muted">
          A shortlist of projects from research, industry, and the side-project
          shelf — chosen for breadth of stack and depth of outcome, not for
          completeness.
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
                <article className="grid gap-6 sm:grid-cols-[1fr_2fr] sm:gap-10">
                  <div className="space-y-4">
                    <Link
                      href={`/work/${slug}`}
                      aria-label={`Open ${frontmatter.title}`}
                      className="block transition-opacity hover:opacity-90"
                    >
                      <ProjectImage project={project} variant="card" />
                    </Link>
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
                        className="group inline-flex items-baseline gap-2 hover:text-accent"
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

                    <ul
                      aria-label="Technology stack"
                      className="mt-5 flex flex-wrap gap-2"
                    >
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
                      <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-widest">
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
