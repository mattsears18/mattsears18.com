# Architecture

This document locks the tech stack and content model for `mattsears18.com`. Decisions here are the baseline future build slices (landing page, portfolio, blog) dispatch against — don't re-litigate without a concrete reason.

Resolves the decisions in [#5](https://github.com/mattsears18/mattsears18.com/issues/5).

## Framework — Next.js 16 (App Router)

The repo was scaffolded with `create-next-app` on Next 14 using the App Router, then upgraded to Next.js 16 + React 19 in [#15](https://github.com/mattsears18/mattsears18.com/pull/15). We're staying on Next + App Router. The App Router is the supported path forward for new Next.js work, server components map cleanly to a content-heavy personal site, and there's no concrete pain point that would justify the cost of porting to Astro / SvelteKit / 11ty. Reach for an alternative only if a specific requirement (e.g., a non-React framework, an islands-architecture mandate) shows up — not preemptively.

## Styling — Tailwind v4 + shadcn/ui

Tailwind is wired up CSS-first per the **v4** model: there is no `tailwind.config.ts`. Configuration lives in `app/globals.css` — the stylesheet starts with `@import "tailwindcss"` (replacing the v3 `@tailwind base/components/utilities` directives), declares design tokens in an `@theme inline { … }` block, and registers the class-based dark variant with `@custom-variant dark (&:where(.dark, .dark *))` (replacing the v3 `darkMode: 'class'` config key). The PostCSS pipeline in `postcss.config.js` uses the dedicated `@tailwindcss/postcss` plugin; v4 handles vendor prefixing internally via Lightning CSS, so `autoprefixer` is no longer a dependency. Source files are auto-detected by v4 — there's no `content` glob array to maintain. The migration from v3 was tracked in [#280](https://github.com/mattsears18/mattsears18.com/issues/280).

For component primitives we'll layer [shadcn/ui](https://ui.shadcn.com/) on top: copy-paste components built on Radix primitives, owned in-repo rather than versioned as an external dependency. The combination gives us accessible, unstyled primitives (Radix), utility-first styling (Tailwind), and full ownership of the component source (shadcn). Custom one-off components are written directly in Tailwind on top of the shadcn primitives. The `cn()` helper in `lib/utils.ts` uses `tailwind-merge` v3 (coupled to the v4 ecosystem) to resolve utility conflicts.

Install on-demand per build slice — don't pre-install the whole shadcn catalog. Each future PR pulls in only the components it actually uses.

## Content model — MDX in repo

Blog posts and long-form content live as `.mdx` files in the repo (likely under `content/` once the blog slice lands). Lowest friction for a personal site: no external CMS to maintain, content is version-controlled alongside code, and MDX lets us embed React components inline where a post needs more than markdown. Authoring happens in any editor; deploys are atomic with code changes.

We're not running a headless CMS (Sanity, Contentful, Contentlayer-as-a-service) — the overhead isn't justified for a single-author site. Revisit only if a non-developer needs to publish, or if content volume makes git-based authoring painful.

## Hosting — Vercel

Vercel for production hosting. Default-target for Next.js (made by the same team), zero-config preview deploys per PR, generous free tier for a personal site, and edge functions / image optimization work out of the box. Domain (`mattsears18.com`) points at Vercel.

Alternatives considered: Cloudflare Pages (good, but Next.js App Router support has rough edges), Netlify (fine, but no advantage over Vercel for a Next.js project), self-hosting (not worth the operational cost for a personal site). Stay on Vercel unless we hit a specific limitation.

## Out of scope for this doc

- Specific routes / page structure (per-slice issues will define those)
- Analytics, error tracking, performance monitoring (file separate issues when needed)
- Auth / API routes (not anticipated for a static-leaning personal site)
- Database (none — content is MDX-in-repo)
