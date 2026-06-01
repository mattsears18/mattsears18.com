# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Version tags align with the `version` field in [`package.json`](./package.json).

## [Unreleased]

### Added

- `/health` liveness endpoint for uptime monitoring ([#169](https://github.com/mattsears18/mattsears18.com/issues/169)).
- `Article` JSON-LD schema on blog post pages ([#164](https://github.com/mattsears18/mattsears18.com/issues/164)).
- `CreativeWork` JSON-LD on work project pages ([#167](https://github.com/mattsears18/mattsears18.com/issues/167)).
- `manifest.webmanifest` for PWA installability ([#141](https://github.com/mattsears18/mattsears18.com/issues/141)).
- Modern PWA icons — build-time 192×192 and 512×512 PNGs via `next/og` ([#144](https://github.com/mattsears18/mattsears18.com/issues/144)).
- Vitest test suite — `lib` unit coverage ([#36](https://github.com/mattsears18/mattsears18.com/issues/36)) and the four public route handlers (`rss.xml`, `llms.txt`, `sitemap.xml`, `robots.txt`) ([#155](https://github.com/mattsears18/mattsears18.com/issues/155)).

### Changed

- Surfaced the Sentry DPA link and cross-border transfer mechanism on the privacy page ([#150](https://github.com/mattsears18/mattsears18.com/issues/150)).
- Aligned `Cache-Control` across `sitemap.xml` and `robots.txt` ([#157](https://github.com/mattsears18/mattsears18.com/issues/157)).
- Shrank the legacy `favicon.ico` from a multi-resolution ICO to a single 32×32 payload ([#144](https://github.com/mattsears18/mattsears18.com/issues/144)).
- Refreshed `/work` imagery — Shipyard marketing graphic, cropped Express Delphi screenshot, and full-bleed hero images on project detail pages.

### Fixed

- Render the RSS autodiscovery `<link>` in `<head>` on every route ([#159](https://github.com/mattsears18/mattsears18.com/issues/159)).
- Report malformed MDX to Sentry instead of dropping it silently ([#153](https://github.com/mattsears18/mattsears18.com/issues/153)).
- Wire App Router error boundaries to `Sentry.captureException` ([#158](https://github.com/mattsears18/mattsears18.com/issues/158)).
- Trim the home meta description under the 160-character snippet limit ([#161](https://github.com/mattsears18/mattsears18.com/issues/161)).
- Raise work-page secondary link tap targets to 44px ([#173](https://github.com/mattsears18/mattsears18.com/issues/173)).
- Scope the blog post card accessible link name to the post title ([#177](https://github.com/mattsears18/mattsears18.com/issues/177)).
- Make the "Get in touch" button work without a default mail client.
- Break `/work` end-year ties by start-year descending.
- Update the NCCER SSO external link to `web.myaccount.nccer.org` ([#130](https://github.com/mattsears18/mattsears18.com/issues/130)).
- Point the VisualEyes paper link at its Google Scholar citation ([#131](https://github.com/mattsears18/mattsears18.com/issues/131)).
- Pin `postcss` to 8.5.15 via overrides to clear GHSA-qx2v-qp2m-jg93.

## [0.1.0] - 2026-05-25

First tracked release. Captures the full rebuild on Next.js 16 + React 19 + Tailwind + MDX, the supporting content model, and the SEO / a11y / observability / DX baseline.

### Added

- Landing page and design foundation — typography, color palette, layout tokens ([#8](https://github.com/mattsears18/mattsears18.com/issues/8)).
- MDX blog at `/blog` with index, per-post pages, and RSS feed ([#10](https://github.com/mattsears18/mattsears18.com/issues/10)).
- Portfolio at `/work` — shortlist of 6 project MDX entries plus per-project detail pages ([#7](https://github.com/mattsears18/mattsears18.com/issues/7), [#9](https://github.com/mattsears18/mattsears18.com/issues/9)).
- Real project screenshots on `/work` cards and detail pages, with MDX frontmatter stripping.
- Branded 404 / not-found page with recovery links ([#75](https://github.com/mattsears18/mattsears18.com/issues/75)).
- SEO basics — Open Graph and Twitter meta, `sitemap.xml`, `robots.txt` ([#11](https://github.com/mattsears18/mattsears18.com/issues/11)).
- Per-route `og:image` and `twitter:image` on `/blog`, `/work`, and `/work/[slug]` via `next/og` ([#55](https://github.com/mattsears18/mattsears18.com/issues/55)).
- Branded 180×180 `apple-touch-icon` generated via `next/og`.
- JSON-LD schemas — `Person`, `WebSite`, and `BreadcrumbList` ([#58](https://github.com/mattsears18/mattsears18.com/issues/58)).
- `/llms.txt` route for AI agent discovery.
- Security response headers — Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy ([#77](https://github.com/mattsears18/mattsears18.com/issues/77)).
- Sentry observability wired into the Next.js runtime and browser ([#43](https://github.com/mattsears18/mattsears18.com/issues/43)).
- Skip-to-main-content link in the root layout for keyboard / screen-reader users.
- CI workflow — lint, type-check, and build on PR and push to `main` ([#81](https://github.com/mattsears18/mattsears18.com/issues/81)).
- Prettier formatter configuration ([#50](https://github.com/mattsears18/mattsears18.com/issues/50)).
- Husky + lint-staged pre-commit hook ([#83](https://github.com/mattsears18/mattsears18.com/issues/83)).
- Dependabot configuration for automated dependency updates.
- `.nvmrc` and `engines.node` to pin the Node runtime.
- MIT `LICENSE` at the repo root.
- `CLAUDE.md` quickstart and `.claude/settings.json` for Claude Code sessions.
- GitHub issue templates and a pull request template.

### Changed

- Upgraded from Next.js 14 to Next.js 16 and React 18 to React 19 ([#14](https://github.com/mattsears18/mattsears18.com/issues/14)).
- Migrated ESLint to flat config — `next lint` was removed in Next.js 16.
- Replaced generic landing copy with a specific bio.
- Replaced the generic RSS feed description with project-specific copy.
- Disabled the Vercel Toolbar in production.
- Refreshed `/work` screenshots (VisualEyes, Shipyard / FleetView) and deduped per-project links.

### Fixed

- Home page meta description — use the full `SITE_DESCRIPTION` instead of a truncated fallback.
- Restored `og:site_name` on all routes via a shared `defaultOpenGraph` helper.
- Dropped the trailing slash from the home sitemap entry ([#70](https://github.com/mattsears18/mattsears18.com/issues/70)).
- Collapsed `/work` card duplicate links to a single stretched-link target.
- Labeled focusable code blocks for screen readers.
- Defined `.prose-post` styles to fix unstyled code blocks and prose in MDX posts.

[Unreleased]: https://github.com/mattsears18/mattsears18.com/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/mattsears18/mattsears18.com/releases/tag/v0.1.0
