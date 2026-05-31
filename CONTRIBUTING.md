# Contributing

Thanks for improving `mattsears18.com`. This project is a personal site built with Next.js, React, TypeScript, Tailwind, and MDX.

## Setup

Use npm with the checked-in lockfile:

```bash
npm ci
npm run dev
```

The local dev server runs at <http://localhost:3000>.

## Branching

Create a short, descriptive branch from `main` for each change:

```bash
git switch main
git pull --ff-only
git switch -c docs/add-contributor-guide
```

Keep the branch to one reviewable concern. If you notice an unrelated bug, open a separate issue or pull request.

## Before opening a pull request

Run the checks that match your change:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`make verify` runs the same lint, typecheck, and build sequence used by CI.

## Project conventions

- Keep changes focused on one concern per pull request.
- Use Conventional Commit-style titles such as `docs(dx): add contributor guide` or `fix(a11y): improve navigation label`.
- Use TypeScript for code changes.
- Prefer Server Components unless a feature needs client-side interactivity.
- Use Tailwind utilities and the existing design tokens in `app/globals.css`.
- Add shadcn/ui primitives only when a change actually uses them.

For more project-specific guidance, see [`CLAUDE.md`](./CLAUDE.md), [`docs/architecture.md`](./docs/architecture.md), and [`docs/design.md`](./docs/design.md).
