# Project images

Drop project screenshots into this directory using the slug from `content/work/<slug>.mdx`:

```
public/work/
├── cdot-duration-predictor.png
├── express-delphi.png
├── lightwork.png
├── nccer-sso.png
├── shipyard.png
└── visual-eyes.png
```

The path in each project's frontmatter (`image: /work/<slug>.png`) is already wired up. When the file lands in this directory, `lib/work.ts` picks it up and the index card + detail page hero render it instead of the fallback initial-card.

## Recommended specs

- **Format**: PNG or JPG (PNG for UI screenshots, JPG for photography). WebP also works.
- **Aspect ratio**: ~16:9 for hero (detail page), ~4:3 for card thumbnails — the source can be either, the layout crops via `object-cover`. Wide is fine.
- **Size**: at least 1200px wide so the detail-page hero stays sharp on 2×/3× displays. Next.js Image optimizes the served sizes automatically.
- **File size**: keep under ~500 KB per image. Run through [Squoosh](https://squoosh.app) or `cwebp -q 80` before committing.

## Fallback

If a file is missing from this directory, `lib/work.ts` strips the `image` frontmatter field at read time and `<ProjectImage>` renders a monochrome initial-card placeholder. So adding/removing images is safe — no broken `<img>` tags, no build errors.
