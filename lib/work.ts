import { promises as fs } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

/**
 * Frontmatter shape for `content/work/*.mdx` projects.
 *
 * Required: title, role, year, summary, tech.
 * Optional: links (external/repo/paper/video — open set), featured (boolean).
 *
 * `links` is intentionally a loose record so MDX authors can add new keys
 * (paper / video / case-study) without re-touching this type — the index +
 * detail pages render whatever keys are present using `formatLinkLabel`.
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
};

export type Project = {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
};

const WORK_DIR = path.join(process.cwd(), 'content', 'work');

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
  return { slug, frontmatter, content };
}

/**
 * Year-sort key. Frontmatter `year` is human-readable ("2024–present",
 * "2015–2018", "2019–2020") — we sort newest-first by the trailing year of
 * the range, treating "present" as the current year so active projects
 * always lead. Ties broken by title to keep the order stable.
 */
function yearSortKey(year: string): number {
  const parts = year.split(/[–-]/).map((p) => p.trim().toLowerCase());
  const tail = parts[parts.length - 1];
  if (tail === 'present') return new Date().getUTCFullYear();
  const n = Number.parseInt(tail, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getAllProjects(): Promise<Project[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(WORK_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
  const projects = await Promise.all(entries.map(readProjectFile));
  return projects
    .filter((p): p is Project => p !== null)
    .sort((a, b) => {
      // Featured first, then most-recent end-year, then title.
      const featDelta = Number(b.frontmatter.featured ?? false) - Number(a.frontmatter.featured ?? false);
      if (featDelta !== 0) return featDelta;
      const yearDelta = yearSortKey(b.frontmatter.year) - yearSortKey(a.frontmatter.year);
      if (yearDelta !== 0) return yearDelta;
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await readProjectFile(`${slug}.mdx`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
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
    demo: 'Demo',
  };
  if (known[key]) return known[key];
  return key
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
