# Contributing

Thanks for your interest in `mattsears18.com`. This is a personal site, but the workflow below keeps contributions easy to review and merge. It's pointer-style — for the locked tech stack and rationale see [`docs/architecture.md`](./docs/architecture.md); for typography, palette, and layout tokens see [`docs/design.md`](./docs/design.md); for the release flow see [`RELEASING.md`](./RELEASING.md).

## Prerequisites

- **Node `>=22.0.0`.** The [`.nvmrc`](./.nvmrc) pins `24.15.0` — run `nvm use` to match.
- **npm.** [`package-lock.json`](./package-lock.json) is the source of truth; don't introduce yarn/pnpm lockfiles.

## Getting started

```bash
git clone https://github.com/mattsears18/mattsears18.com.git
cd mattsears18.com
npm ci        # clean, lockfile-driven install (or `make setup`)
npm run dev   # dev server on http://localhost:3000
```

If you've hopped branches and touched `package.json` / `package-lock.json`, run `make clean && npm ci` to evict stale packages rather than letting `npm install` reconcile in place.

## Branching

- Branch off `main`. Use a short, descriptive branch name — e.g. `feat/work-card-hover`, `fix/rss-pubdate`, `content/express-delphi`.
- One concern per branch and per PR. Open a new issue for drive-by bugs you spot rather than folding them into an unrelated PR.

## Making changes

This repo follows a few conventions worth knowing before you write code:

- **TypeScript everywhere.** Prefer Server Components; reach for `'use client'` only when an interactive surface needs it.
- **Tailwind for styling**, not CSS modules. Design tokens (colors, fonts) are CSS custom properties in [`app/globals.css`](./app/globals.css) consumed via [`tailwind.config.ts`](./tailwind.config.ts).
- **New long-form prose surfaces** must define their styles under the `.prose-post` component layer in `globals.css` — the Tailwind typography plugin is intentionally not installed, so MDX renders unstyled without explicit rules.
- **shadcn/ui primitives are installed on-demand.** Each PR adds only the components it uses; don't pre-pull the catalog.
- **Stage paths explicitly** — no `git add -A`.

### Content

- `content/posts/*.mdx` — blog posts. Required frontmatter: `title`, `date`, `excerpt`. Optional: `tags`, `draft`.
- `content/work/*.mdx` — portfolio projects. Required frontmatter: `title`, `role`, `year`, `summary`, `tech[]`. Optional: `links`, `featured`, `image`, `imageAlt`.

Work-card images fall back to the initial card when the referenced asset isn't on disk, so you can set the convention path eagerly and drop the PNG in later.

## Running checks locally

CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs `npm ci` → lint → type check → build on every PR and push to `main`. Match it locally before pushing:

| Command            | What it does                                 |
| ------------------ | -------------------------------------------- |
| `npm run lint`     | ESLint via flat config (`eslint.config.mjs`) |
| `npx tsc --noEmit` | Type check (CI runs this — match it locally) |
| `npm run build`    | Production build                             |
| `npm test`         | Vitest unit tests (`vitest.config.ts`)       |
| `npm run format`   | Prettier write across the repo               |

The fastest "is it green?" check mirrors CI in one command:

```bash
make verify   # lint + typecheck + build
```

Husky + lint-staged auto-format staged files on commit per [`.lintstagedrc.json`](./.lintstagedrc.json). **Don't pass `--no-verify`** to skip the hook — let it format your staged files.

## Commits and pull requests

- **Conventional Commits titles**, scoped to the area changed: `feat(seo):`, `fix(a11y):`, `chore(dx):`, `docs(dx):`, `content(home):`. The PR title follows the same convention.
- **Single-purpose commits.** When a change has logically distinct parts (a bug fix + a copy tweak), split them into separate commits with `git add -p`. Group by topic, not by when they were authored.
- Open the PR against `main`. Vercel posts a preview URL on every PR; use it to sanity-check rendered output.
- Fill in what changed and how you verified it. Link the issue the PR addresses with `Closes #<N>` so it auto-closes on merge.

## Review and merge

- A maintainer reviews every PR before it lands. CI (lint, type check, build) must be green.
- Keep PRs focused and reviewable — small, single-concern diffs merge fastest.
- Don't edit `.github/workflows/` or the locked docs ([`docs/architecture.md`](./docs/architecture.md), [`docs/design.md`](./docs/design.md)) inside a feature PR. Bring repo-config or locked-decision changes through their own issue.

## Releases

Releases are versioned by [SemVer](https://semver.org) and tagged `vX.Y.Z` against `main`. See [`RELEASING.md`](./RELEASING.md) for the full flow; the mechanics live in [`scripts/release.sh`](./scripts/release.sh) (wrapped by `make release KIND=<patch|minor|major>`). Day-to-day contributors don't cut releases — the maintainer does.

## License

By contributing, you agree that your contributions are licensed under the repository's [LICENSE](./LICENSE).
