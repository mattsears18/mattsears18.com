import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let tmpDir: string;
const realCwd = process.cwd.bind(process);

async function writeProject(slug: string, frontmatter: Record<string, unknown>, body = 'Body.') {
  const yaml = Object.entries(frontmatter)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
  await fs.writeFile(
    path.join(tmpDir, 'content', 'work', `${slug}.mdx`),
    `---\n${yaml}\n---\n${body}\n`,
    'utf8',
  );
}

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'work-test-'));
  await fs.mkdir(path.join(tmpDir, 'content', 'work'), { recursive: true });
  await fs.mkdir(path.join(tmpDir, 'public', 'work'), { recursive: true });
  vi.spyOn(process, 'cwd').mockReturnValue(tmpDir);
  vi.resetModules();
});

afterEach(async () => {
  vi.restoreAllMocks();
  await fs.rm(tmpDir, { recursive: true, force: true });
  process.cwd = realCwd;
});

describe('getAllProjects', () => {
  it('sorts by featured first, then by end-year desc, then by title', async () => {
    await writeProject('beta', {
      title: 'Beta',
      role: 'Eng',
      year: '2019',
      summary: 's',
      tech: ['a'],
    });
    await writeProject('alpha', {
      title: 'Alpha',
      role: 'Eng',
      year: '2019',
      summary: 's',
      tech: ['a'],
    });
    await writeProject('older', {
      title: 'Older',
      role: 'Eng',
      year: '2015',
      summary: 's',
      tech: ['a'],
    });
    await writeProject('featured', {
      title: 'Featured',
      role: 'Eng',
      year: '2015',
      summary: 's',
      tech: ['a'],
      featured: true,
    });

    const { getAllProjects } = await import('./work');
    const projects = await getAllProjects();

    expect(projects.map((p) => p.slug)).toEqual(['featured', 'alpha', 'beta', 'older']);
  });

  it('treats "present" as the current UTC year so active projects lead', async () => {
    const currentYear = new Date().getUTCFullYear();
    await writeProject('past-year', {
      title: 'Past',
      role: 'Eng',
      year: String(currentYear - 1),
      summary: 's',
      tech: ['a'],
    });
    await writeProject('active', {
      title: 'Active',
      role: 'Eng',
      year: `${currentYear - 2}–present`,
      summary: 's',
      tech: ['a'],
    });

    const { getAllProjects } = await import('./work');
    const projects = await getAllProjects();

    expect(projects[0].slug).toBe('active');
  });

  it('parses range strings by the trailing year', async () => {
    await writeProject('range', {
      title: 'Range',
      role: 'Eng',
      year: '2015–2018',
      summary: 's',
      tech: ['a'],
    });
    await writeProject('older-end', {
      title: 'Older',
      role: 'Eng',
      year: '2010–2014',
      summary: 's',
      tech: ['a'],
    });

    const { getAllProjects } = await import('./work');
    const projects = await getAllProjects();

    expect(projects.map((p) => p.slug)).toEqual(['range', 'older-end']);
  });

  it('treats unparseable year strings as 0 (sorted last)', async () => {
    await writeProject('garbage-year', {
      title: 'Garbage',
      role: 'Eng',
      year: 'whenever',
      summary: 's',
      tech: ['a'],
    });
    await writeProject('real', {
      title: 'Real',
      role: 'Eng',
      year: '2020',
      summary: 's',
      tech: ['a'],
    });

    const { getAllProjects } = await import('./work');
    const projects = await getAllProjects();

    expect(projects.map((p) => p.slug)).toEqual(['real', 'garbage-year']);
  });

  it('strips image + imageAlt when the referenced public file is missing', async () => {
    await writeProject('no-asset', {
      title: 'No Asset',
      role: 'Eng',
      year: '2020',
      summary: 's',
      tech: ['a'],
      image: '/work/missing.png',
      imageAlt: 'should be stripped',
    });

    const { getAllProjects } = await import('./work');
    const [project] = await getAllProjects();

    expect(project.frontmatter.image).toBeUndefined();
    expect(project.frontmatter.imageAlt).toBeUndefined();
  });

  it('keeps image + imageAlt when the referenced public file exists', async () => {
    await fs.writeFile(path.join(tmpDir, 'public', 'work', 'present.png'), 'fake-png', 'binary');
    await writeProject('has-asset', {
      title: 'Has Asset',
      role: 'Eng',
      year: '2020',
      summary: 's',
      tech: ['a'],
      image: '/work/present.png',
      imageAlt: 'kept',
    });

    const { getAllProjects } = await import('./work');
    const [project] = await getAllProjects();

    expect(project.frontmatter.image).toBe('/work/present.png');
    expect(project.frontmatter.imageAlt).toBe('kept');
  });

  it('throws with the slug in the error when required frontmatter is missing', async () => {
    await writeProject('incomplete', { title: 'Only title' });

    const { getAllProjects } = await import('./work');

    await expect(getAllProjects()).rejects.toThrow(/incomplete/);
  });

  it('throws when tech is an empty array', async () => {
    await writeProject('no-tech', {
      title: 'No Tech',
      role: 'Eng',
      year: '2020',
      summary: 's',
      tech: [],
    });

    const { getAllProjects } = await import('./work');

    await expect(getAllProjects()).rejects.toThrow(/no-tech/);
  });

  it('returns an empty array when the work directory does not exist', async () => {
    await fs.rm(path.join(tmpDir, 'content', 'work'), { recursive: true });

    const { getAllProjects } = await import('./work');
    const projects = await getAllProjects();

    expect(projects).toEqual([]);
  });
});

describe('formatLinkLabel', () => {
  it('returns the known label for a recognized key', async () => {
    const { formatLinkLabel } = await import('./work');
    expect(formatLinkLabel('repo')).toBe('Repository');
    expect(formatLinkLabel('github')).toBe('GitHub');
    expect(formatLinkLabel('external')).toBe('Visit');
  });

  it('title-cases unknown keys and replaces dashes / underscores with spaces', async () => {
    const { formatLinkLabel } = await import('./work');
    expect(formatLinkLabel('case-study')).toBe('Case Study');
    expect(formatLinkLabel('press_release')).toBe('Press Release');
    expect(formatLinkLabel('demo-v2')).toBe('Demo V2');
  });
});
