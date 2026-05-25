# mattsears18.com

Personal site for Matt Sears. Next.js 16 (App Router) + React 19 + Tailwind + MDX, deployed on Vercel.

See [`docs/architecture.md`](./docs/architecture.md) for the locked tech stack and content model, and [`docs/design.md`](./docs/design.md) for typography, palette, and layout tokens.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build (run before pushing) |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint via `next lint` |

## Deployment

Vercel handles deploys. Pushes to `main` trigger production; every PR gets a preview URL.
