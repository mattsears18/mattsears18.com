import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import sharp from 'sharp';

import { reportError } from './logger';

/**
 * Frontmatter shape for `content/work/*.mdx` projects.
 *
 * Required: title, role, year, summary, tech.
 * Optional: links (external/repo/paper/video — open set), featured (boolean),
 * image + imageAlt (thumbnail / hero — see `image` rules below).
 *
 * `links` is intentionally a loose record so MDX authors can add new keys
 * (paper / video / case-study) without re-touching this type — the index +
 * detail pages render whatever keys are present using `formatLinkLabel`.
 *
 * `image` is a public-root path like `/work/lightwork.jpg`. If the file is
 * missing from `public/`, `getAllProjects` strips the field at read time so
 * the UI falls back to the generated initial-card instead of rendering a
 * broken <Image>. This lets MDX authors set the convention path eagerly and
 * drop in the real PNG later without a page-render regression.
 */
export type ProjectLinks = Record<string, string>;

export type ProjectFrontmatter = {
  title: string;
  role: string;
  year: string;
  summary: string;
  tech: string[];
  links?: ProjectLinks;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
};

export type ImageDimensions = { width: number; height: number };

export type Project = {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
  /**
   * Intrinsic pixel dimensions of `frontmatter.image`, measured from disk at
   * read time. Present only when `frontmatter.image` survived the on-disk
   * check below. The hero renders at this natural aspect ratio so a portrait
   * screenshot or an off-16:9 illustration isn't letterboxed inside a fixed
   * box (no dead side-margins). Falls back to the fixed-aspect box when
   * absent. See #298-followup.
   */
  imageDimensions?: ImageDimensions;
};

const WORK_DIR = path.join(process.cwd(), 'content', 'work');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function fileExists(absPath: string): Promise<boolean> {
  try {
    await fs.access(absPath);
    return true;
  } catch {
    return false;
  }
}

async function readProjectFile(filename: string): Promise<Project | null> {
  if (!filename.endsWith('.mdx')) return null;
  const slug = filename.replace(/\.mdx$/, '');
  const raw = await fs.readFile(path.join(WORK_DIR, filename), 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = data as ProjectFrontmatter;
  if (
    !frontmatter.title ||
    !frontmatter.role ||
    !frontmatter.year ||
    !frontmatter.summary ||
    !Array.isArray(frontmatter.tech) ||
    frontmatter.tech.length === 0
  ) {
    throw new Error(
      `Project ${slug} is missing required frontmatter (title, role, year, summary, tech[])`,
    );
  }
  let imageDimensions: ImageDimensions | undefined;
  if (frontmatter.image) {
    // public-root paths only; strip the field if the asset isn't on disk so
    // the UI renders the initial-card fallback instead of a broken <Image>.
    const onDisk = frontmatter.image.startsWith('/')
      ? path.join(PUBLIC_DIR, frontmatter.image)
      : null;
    if (!onDisk || !(await fileExists(onDisk))) {
      delete frontmatter.image;
      delete frontmatter.imageAlt;
    } else {
      // Measure intrinsic dimensions so the hero can render at the image's
      // natural aspect ratio. Best-effort: a measurement failure leaves
      // `imageDimensions` undefined and the UI falls back to the fixed box.
      try {
        const { width, height } = await sharp(onDisk).metadata();
        if (width && height) imageDimensions = { width, height };
      } catch (err) {
        reportError(err, { op: 'measureProjectImage', slug });
      }
    }
  }
  return { slug, frontmatter, content, imageDimensions };
}

/**
 * Year-sort keys. Frontmatter `year` is human-readable ("2024–present",
 * "2015–2018", "2019–2020") — we sort newest-first by the trailing year of
 * the range, treating "present" as the current year so active projects
 * always lead. When end-years tie (common for "*-present" projects), the
 * later start-year wins so a newer active project leads an older active
 * one. Final tie-break is title to keep order stable.
 */
function yearPartKey(part: string | undefined): number {
  if (!part) return 0;
  const p = part.trim().toLowerCase();
  if (p === 'present') return new Date().getUTCFullYear();
  const n = Number.parseInt(p, 10);
  return Number.isFinite(n) ? n : 0;
}

function yearSortKey(year: string): number {
  const parts = year.split(/[–-]/);
  return yearPartKey(parts[parts.length - 1]);
}

function yearStartSortKey(year: string): number {
  const parts = year.split(/[–-]/);
  return yearPartKey(parts[0]);
}

export async function getAllProjects(): Promise<Project[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(WORK_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  // Per-file isolation: a single malformed project file (bad YAML, missing
  // required frontmatter) is reported to Sentry and skipped rather than
  // throwing out of the map and zeroing the entire work listing / sitemap /
  // llms.txt. See #153.
  const projects = await Promise.all(
    entries.map(async (filename) => {
      try {
        return await readProjectFile(filename);
      } catch (err) {
        const slug = filename.replace(/\.mdx$/, '');
        reportError(err, { op: 'readProject', slug });
        return null;
      }
    }),
  );
  return projects
    .filter((p): p is Project => p !== null)
    .sort((a, b) => {
      // Featured first, then most-recent end-year, then most-recent start-year, then title.
      const featDelta =
        Number(b.frontmatter.featured ?? false) - Number(a.frontmatter.featured ?? false);
      if (featDelta !== 0) return featDelta;
      const yearDelta = yearSortKey(b.frontmatter.year) - yearSortKey(a.frontmatter.year);
      if (yearDelta !== 0) return yearDelta;
      const startDelta =
        yearStartSortKey(b.frontmatter.year) - yearStartSortKey(a.frontmatter.year);
      if (startDelta !== 0) return startDelta;
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await readProjectFile(`${slug}.mdx`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    // Report the parse/read failure before returning the fallback so a
    // malformed project that 404s leaves an operator breadcrumb instead of
    // vanishing silently. See #153.
    reportError(err, { op: 'readProject', slug });
    return null;
  }
}

/**
 * Render-friendly label for arbitrary `links` keys. Maps known keys to nicer
 * labels; falls back to title-case for unknown keys so new link types ("demo",
 * "case-study") render reasonably without a code change.
 */
export function formatLinkLabel(key: string): string {
  const known: Record<string, string> = {
    external: 'Visit',
    repo: 'Repository',
    github: 'GitHub',
    paper: 'Paper',
    video: 'Video',
    youtube: 'YouTube',
    demo: 'Demo',
  };
  if (known[key]) return known[key];
  return key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
