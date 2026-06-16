import Image from 'next/image';

import { LightboxTrigger } from '@/app/components/lightbox-image';
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
  const { frontmatter, slug, imageDimensions } = project;
  // The hero renders at the image's natural aspect ratio (full width, auto
  // height) when we measured its dimensions — no fixed box, so off-16:9
  // images aren't letterboxed with dead side-margins. Cards keep the fixed
  // 4:3 crop for a tidy grid. Without dimensions we fall back to the old
  // fixed-aspect box.
  const heroNatural = variant === 'hero' && imageDimensions != null;
  const wrapperClass = [
    'relative overflow-hidden rounded-lg border border-border bg-bg-elevated',
    heroNatural ? '' : variant === 'hero' ? 'aspect-[16/9]' : 'aspect-[4/3]',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (frontmatter.image) {
    const alt = frontmatter.imageAlt ?? `${frontmatter.title} — project preview`;
    const visual = (
      <div className={wrapperClass}>
        {heroNatural ? (
          <Image
            src={frontmatter.image}
            alt={alt}
            width={imageDimensions.width}
            height={imageDimensions.height}
            sizes={SIZES_BY_VARIANT[variant]}
            priority
            className="h-auto w-full"
          />
        ) : (
          <Image
            src={frontmatter.image}
            alt={alt}
            fill
            sizes={SIZES_BY_VARIANT[variant]}
            priority={variant === 'hero'}
            className={variant === 'hero' ? 'object-contain' : 'object-cover'}
          />
        )}
      </div>
    );
    /*
     * Hero opens fullsize in a lightbox (#231). Cards stay plain — the
     * card's stretched `<Link>` overlay owns the click there, and stacking
     * a second interactive target under it would fight the navigation.
     */
    if (variant === 'hero') {
      return (
        <LightboxTrigger src={frontmatter.image} alt={alt}>
          {visual}
        </LightboxTrigger>
      );
    }
    return visual;
  }

  const initial = frontmatter.title.trim().charAt(0).toUpperCase() || '·';
  return (
    <div
      className={`${wrapperClass} from-bg-elevated via-bg to-bg-elevated bg-gradient-to-br`}
      role="img"
      aria-label={`${frontmatter.title} — placeholder`}
      data-project-slug={slug}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          aria-hidden="true"
          className="font-display text-fg-muted/40 text-7xl font-medium tracking-tight sm:text-8xl"
        >
          {initial}
        </span>
      </div>
      <div className="border-border bg-bg/60 absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t px-3 py-2 backdrop-blur-sm">
        <span className="text-fg-muted font-mono text-[10px] tracking-widest uppercase">
          {frontmatter.title}
        </span>
        <span className="text-fg-muted font-mono text-[10px] tracking-widest uppercase">
          {frontmatter.year}
        </span>
      </div>
    </div>
  );
}
