# Design

This document locks the design language for `mattsears18.com` — typography, palette, layout vocabulary. Build slices (#8 landing, #10 blog, #9 portfolio, #11 SEO/polish) implement against this. Don't re-litigate without a concrete reason; raise a follow-up issue if a token needs revisiting.

Resolves the design step of [#6](https://github.com/mattsears18/mattsears18.com/issues/6); see the [original design call](https://github.com/mattsears18/mattsears18.com/issues/6#issuecomment-4529564277) for the full rationale.

## Audience + posture

Optimizing for one reader: **a recruiter or hiring manager screening for a senior/lead software engineer role**. Roughly 30 seconds on first pass, maybe 5 minutes if the site passes their gut check. That gut check:

1. Does this site itself look like good engineering? (clean, fast, accessible — proof by example)
2. Can I tell what they actually do, fast? (clarity > cleverness)
3. Does the writing show they think clearly?
4. Do I want to read more? (typography + restraint)

The wrong direction for that reader is heavy 3D / Three.js portfolios, IDE-theme cosplay sites, maximalist animation-heavy designs. The right direction is **editorial, writing-first, restrained, with one or two small details that prove craft**.

Strongest references, descending priority: [brittanychiang.com](https://brittanychiang.com), [leerob.io](https://leerob.io), [joshwcomeau.com](https://joshwcomeau.com), [bonhomme.lol](https://bonhomme.lol), [cassidoo.co](https://cassidoo.co).

## Typography

| Role | Choice | Notes |
|---|---|---|
| Display (hero, section headings) | **Geist Sans** | Modern, technical. Self-hosted via `next/font`. |
| Body / UI | **Inter** | Workhorse. Cohesive with Geist. |
| Long-form (blog post body) | **Source Serif 4** | Transitional serif. Default for posts; sans for everything else. |
| Mono (code, dates, kbd) | **JetBrains Mono** | Self-hosted via `next/font`. |

All fonts self-hosted (no FOIT, no Google CDN call at runtime).

**Type scale**: modular scale at ratio 1.25, ~12px base.

- Hero display: 56–72px desktop, 40–48px mobile.
- Body: 17–18px (deliberately larger than the 16px default — improves blog readability).

**Measure**: 65–72ch on blog post bodies. Don't let lines run full container width.

CSS variable bindings (set in `app/layout.tsx` via `next/font` and consumed by `tailwind.config.ts`):

- `--font-display` → Geist Sans
- `--font-sans` → Inter
- `--font-serif` → Source Serif 4
- `--font-mono` → JetBrains Mono

## Color palette

Restrained, two-mode. Tokens are declared as CSS custom properties on `:root` (light) and `.dark` (dark) and surfaced as Tailwind theme colors.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FAFAF9` | `#0A0A0A` | Page background. Dark is near-black, NOT pure `#000`. |
| `bg-elevated` | `#FFFFFF` | `#171717` | Cards, code blocks. |
| `fg` | `#171717` | `#FAFAF9` | Body text. |
| `fg-muted` | `#525252` | `#A3A3A3` | Secondary text, dates. |
| `border` | `#E5E5E5` | `#262626` | Hairlines. |
| `accent` | `#C2410C` | `#FB923C` | Links, CTAs, current-section indicators. |

**Accent rationale**: skip default-blue. A warm orange reads as a thoughtful color choice and pairs cleanly with both modes. Contrast meets WCAG AA for body-size text in both themes.

**Dark as default**, with a toggle. Persisted via `localStorage`, falls back to `prefers-color-scheme`. Toggle lives top-right of the header, no animation drama. No theme-flash on load — class is set on `<html>` before first paint via an inline script.

## Layout vocabulary

- **Container max-width**: 1100px on landing / work pages. 720px on blog post bodies.
- **Side gutters**: 24px mobile, 48px tablet, scales generously on desktop.
- **Section rhythm**: 96–128px vertical between major sections desktop, 64–80px mobile. Whitespace is doing structural work — not boxes / cards / dividers.
- **Grid**: 12-col CSS grid only where it earns its keep (project cards). Otherwise flow + max-width.
- **Asymmetric where useful**: hero is left-aligned (not centered). Project cards can break out of the reading column on desktop.
- **No card shadows.** Use hairline borders (`border-token`) and background-color shifts for separation.

## Per-slice notes

- **Landing (#8)**: hero takes ~70–80vh on desktop. Headline = role + positioning in one line, max two. Sub-line = one sentence of supporting context. Two CTAs: primary ("Get in touch"), secondary ("See my work"). No portrait photo — text-first is more senior-coded.
- **Blog (#10)**: index = chronological reverse list, each row = title (large), date, ~2-line excerpt. No card boxing. Post body = serif, generous measure, JetBrains Mono for code, syntax highlighting via Shiki.
- **Work (#9)**: list-style index, each project = title + 1-line role + 2–3 stack badges + 2–3 line "what + outcome". Top 1–2 projects get a detail page using blog typography.

## Out of scope for this doc

- Specific route structure beyond the per-slice notes above (per-slice issues own that)
- Component-library inventory beyond "install shadcn primitives on-demand per slice"
- Imagery / illustration system (not anticipated; the site is text-first by design)
