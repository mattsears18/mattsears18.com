# CLAUDE.md

Repo-scoped guidance for Claude Code sessions on `mattsears18.com`. Pointer-style — for the locked tech stack and rationale see [`docs/architecture.md`](./docs/architecture.md); for typography, palette, and layout tokens see [`docs/design.md`](./docs/design.md). Don't restate those here.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 + MDX, deployed on Vercel. Sentry wired via `@sentry/nextjs`. Node `>=22.0.0` (`.nvmrc` pins `24.15.0`). Package manager is **npm** — `package-lock.json` is the source of truth.

## Content model

- `content/posts/*.mdx` — blog posts, surfaced via [`lib/posts.ts`](./lib/posts.ts). Required frontmatter: `title`, `date`, `excerpt`. Optional: `tags`, `draft`.
- `content/work/*.mdx` — portfolio projects, surfaced via [`lib/work.ts`](./lib/work.ts). Required frontmatter: `title`, `role`, `year`, `summary`, `tech[]`. Optional: `links`, `featured`, `image`, `imageAlt`. Year sort treats `"present"` as the current year; ties broken by title.
- Both readers use `gray-matter` and live entirely at build time — no DB, no CMS.

## Commands

| Command            | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Dev server on port 3000                                   |
| `npm run build`    | Production build — run before pushing if you touched code |
| `npm start`        | Serve the built site locally                              |
| `npm run lint`     | ESLint via flat config (`eslint.config.mjs`)              |
| `npx tsc --noEmit` | Type check (CI runs this — match it locally)              |
| `npm run format`   | Prettier write across the repo                            |

CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) runs `npm ci` → `lint` → `tsc --noEmit` → `build` on every PR + push to `main`. Husky + lint-staged auto-format staged files on commit per [`.lintstagedrc.json`](./.lintstagedrc.json) — don't `--no-verify` to skip.

## Conventions

- **TypeScript everywhere.** Prefer Server Components; reach for `'use client'` only when an interactive surface needs it.
- **Tailwind v4 for styling** (CSS-first, no `tailwind.config.ts`), not CSS modules. Config lives in [`app/globals.css`](./app/globals.css): `@import "tailwindcss"`, an `@theme inline { … }` block for design tokens, and `@custom-variant dark` for class-based dark mode. Design tokens (colors, fonts) are CSS custom properties in `globals.css` surfaced into the theme — colors as `--color-*-rgb` channels wrapped by `rgb(var(--color-*-rgb))` in `@theme inline`. PostCSS uses `@tailwindcss/postcss` (no `autoprefixer` — v4 prefixes via Lightning CSS). Add new long-form prose surfaces under the `.prose-post` component layer in `globals.css` — the Tailwind typography plugin is intentionally not installed.
- **Single-purpose commits, Conventional Commits titles** (`feat(seo):`, `fix(a11y,web):`, `chore(dx):`, `docs(dx):`, `content(home):`). One concern per PR — open a new issue for drive-by bugs you spot.
- **No `git add -A`.** Stage paths explicitly.
- **shadcn/ui primitives are installed on-demand.** Don't pre-pull the catalog; each PR adds only what it uses.

## Gotchas worth remembering

- **Always define `.prose-post` styles when adding a new prose surface.** Without explicit styles MDX renders unstyled — see [#27](https://github.com/mattsears18/mattsears18.com/pull/27) for the symptom + fix pattern.
- **iTerm screenshots crop the title bar.** Re-crop screenshots before committing them under `public/` (esp. `public/work/*.png`) — see [#28](https://github.com/mattsears18/mattsears18.com/pull/28).
- **Work-card images fall back to the initial card if the public path is missing.** `lib/work.ts` strips `image` / `imageAlt` at read time when the referenced asset isn't on disk, so MDX authors can set the convention path eagerly and drop the PNG in later without a render regression. Don't fight this — drop the file in or leave the field unset.
- **Year sort in `lib/work.ts` is end-year–based**, with `"present"` resolving to `new Date().getUTCFullYear()`. Active projects always lead. Don't normalize the human-readable year format.
- **`rehype-pretty-code` is configured with `keepBackground: false`** so code-block backgrounds come from our design tokens, not the Shiki theme. If a new prose surface needs syntax highlighting, copy the `.prose-post pre` rules in `globals.css` — don't re-enable `keepBackground`.

## Auto-merge

**Always auto-merge PRs in this repo** — don't leave a PR sitting for the user to merge manually. Repo-level auto-merge is **enabled** (`allow_auto_merge: true`), so arm it on every PR right after creating it: `gh pr merge <M> --auto --merge --delete-branch`. GitHub then merges automatically once CI goes green (or immediately if checks already passed). No need to poll and merge by hand.

## What not to touch

- `.github/workflows/` — CI definitions are stable; bring repo-config changes through a separate issue.
- `docs/architecture.md` / `docs/design.md` — these lock decisions deliberately. Raise a follow-up issue if a token needs revisiting rather than editing in-line during a feature PR.
