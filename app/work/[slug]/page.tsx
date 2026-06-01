import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/app/components/json-ld';
import { ProjectImage } from '@/app/components/project-image';
import { breadcrumbListSchema, creativeWorkSchema } from '@/lib/json-ld';
import { formatLinkLabel, getAllProjects, getProjectBySlug } from '@/lib/work';
import { defaultOpenGraph, SITE_TITLE } from '@/lib/site';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const canonical = `/work/${slug}`;
  return {
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    authors: [{ name: SITE_TITLE }],
    alternates: { canonical },
    openGraph: {
      ...defaultOpenGraph,
      title: project.frontmatter.title,
      description: project.frontmatter.summary,
      type: 'article',
      url: canonical,
      authors: [SITE_TITLE],
      tags: project.frontmatter.tech,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.frontmatter.title,
      description: project.frontmatter.summary,
    },
  };
}

/**
 * `/work/<slug>` — project detail page.
 *
 * Mirrors the blog post layout (max-w-reading, generous vertical rhythm)
 * because design.md calls for blog typography on the top 1–2 case studies —
 * we apply it uniformly so every project gets the same reading treatment.
 *
 * MDX body is dynamically imported from `content/work/<slug>.mdx`; the
 * `generateStaticParams` enumeration ensures every slug renders at build
 * time, which keeps the import path statically analyzable.
 */
export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { default: MDXContent } = await import(`@/content/work/${slug}.mdx`);
  const links = project.frontmatter.links ?? {};

  return (
    <article className="mx-auto max-w-reading py-12 sm:py-16">
      <JsonLd
        schema={[
          breadcrumbListSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: project.frontmatter.title, path: `/work/${slug}` },
          ]),
          creativeWorkSchema({
            title: project.frontmatter.title,
            summary: project.frontmatter.summary,
            slug,
            tech: project.frontmatter.tech,
            year: project.frontmatter.year,
            links: Object.values(links),
          }),
        ]}
      />
      <nav className="mb-10">
        <Link
          href="/work"
          className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
        >
          ← Back to work
        </Link>
      </nav>

      <header className="mb-10 sm:mb-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-muted">
          <span>{project.frontmatter.role}</span>
          <span aria-hidden="true"> · </span>
          <span>{project.frontmatter.year}</span>
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl lg:text-display-sm">
          {project.frontmatter.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-fg-muted">{project.frontmatter.summary}</p>

        <ul aria-label="Technology stack" className="mt-6 flex flex-wrap gap-2">
          {project.frontmatter.tech.map((tech) => (
            <li
              key={tech}
              className="rounded border border-border px-2 py-1 font-mono text-xs text-fg-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        {Object.keys(links).length > 0 ? (
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-widest">
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
      </header>

      <ProjectImage project={project} variant="hero" className="mb-10 sm:mb-12" />

      <div className="prose-post">
        <MDXContent />
      </div>

      <footer className="mt-20 border-t border-border pt-8">
        <Link
          href="/work"
          className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
        >
          All work →
        </Link>
      </footer>
    </article>
  );
}
