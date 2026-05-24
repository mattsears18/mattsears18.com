import Image from 'next/image';

import type { Project } from '@/lib/work';

type Props = {
  project: Project;
  /**
   * `card` — index-card aspect, lazy-loaded, smaller sizes hint.
   * `hero` — detail-page hero, eager-loaded with priority for LCP.
   */
  variant: 'card' | 'hero';
  className?: string;
};

const SIZES_BY_VARIANT: Record<Props['variant'], string> = {
  card: '(min-width: 640px) 33vw, 100vw',
  hero: '(min-width: 768px) 720px, 100vw',
};

/**
 * Project visual — uses the frontmatter `image` when present, otherwise
 * renders a monochrome initial-card fallback so projects without a
 * screenshot still get a real visual element instead of a blank space.
 *
 * `lib/work.ts` strips the `image` field when the referenced file is
 * missing from `public/`, so by the time we render here `project.image`
 * means "asset exists" — no broken-img edge case to handle in JSX.
 */
export function ProjectImage({ project, variant, className }: Props) {
  const { frontmatter, slug } = project;
  const wrapperClass = [
    'relative overflow-hidden rounded-lg border border-border bg-bg-elevated',
    variant === 'hero' ? 'aspect-[16/9]' : 'aspect-[4/3]',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (frontmatter.image) {
    return (
      <div className={wrapperClass}>
        <Image
          src={frontmatter.image}
          alt={frontmatter.imageAlt ?? `${frontmatter.title} — project preview`}
          fill
          sizes={SIZES_BY_VARIANT[variant]}
          priority={variant === 'hero'}
          className="object-cover"
        />
      </div>
    );
  }

  const initial = frontmatter.title.trim().charAt(0).toUpperCase() || '·';
  return (
    <div
      className={`${wrapperClass} bg-gradient-to-br from-bg-elevated via-bg to-bg-elevated`}
      role="img"
      aria-label={`${frontmatter.title} — placeholder`}
      data-project-slug={slug}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden="true"
          className="font-display text-7xl font-medium tracking-tight text-fg-muted/40 sm:text-8xl"
        >
          {initial}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-border bg-bg/60 px-3 py-2 backdrop-blur-sm">
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">
          {frontmatter.title}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-muted">
          {frontmatter.year}
        </span>
      </div>
    </div>
  );
}
