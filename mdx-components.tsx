import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';

import { LightboxImage } from '@/app/components/lightbox-image';

/*
 * Human-readable language labels for screen-reader announcement of code blocks.
 * `rehype-pretty-code` sets `data-language` from the fenced-code annotation
 * (```ts → "ts", ```jsx → "jsx", etc.). Map the short token to a friendly name
 * when one is known; otherwise pass the token through verbatim so unknown
 * languages still produce a meaningful label.
 *
 * Pre-rendered `aria-label`s are stable across server/client, so this can stay
 * a Server Component without any hydration concerns.
 */
const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  diff: 'Diff',
  go: 'Go',
  graphql: 'GraphQL',
  html: 'HTML',
  ini: 'INI',
  java: 'Java',
  js: 'JavaScript',
  javascript: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  md: 'Markdown',
  markdown: 'Markdown',
  mdx: 'MDX',
  python: 'Python',
  py: 'Python',
  rb: 'Ruby',
  ruby: 'Ruby',
  rust: 'Rust',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  svg: 'SVG',
  swift: 'Swift',
  toml: 'TOML',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  xml: 'XML',
  yaml: 'YAML',
  yml: 'YAML',
};

/*
 * Override the MDX `<pre>` renderer so the focusable code container
 * (shiki/rehype-pretty-code adds `tabindex="0"` for keyboard scrolling)
 * carries an accessible name. Without this, a Tab into the block announces
 * only the raw code text, violating WCAG 2.1 AA 4.1.2 (Name, Role, Value).
 *
 * The label is derived from the `data-language` attribute that
 * `rehype-pretty-code` writes onto the `<pre>` element. Fences without a
 * language hint fall through to a generic "Code sample" label.
 *
 * See [#73](https://github.com/mattsears18/mattsears18.com/issues/73).
 */
function CodeBlockPre(props: ComponentPropsWithoutRef<'pre'>) {
  // rehype-pretty-code (via shiki) emits `data-language` on the <pre>; in MDX
  // / React this surfaces as a string-valued data attribute on the props bag.
  const language = (props as Record<string, unknown>)['data-language'];
  const languageKey = typeof language === 'string' ? language.toLowerCase() : '';
  const languageLabel = LANGUAGE_LABELS[languageKey] ?? language;
  const ariaLabel =
    typeof languageLabel === 'string' && languageLabel.length > 0
      ? `Code sample: ${languageLabel}`
      : 'Code sample';

  // Respect any aria-label the MDX author or upstream transformer already set —
  // we only add one when it's missing.
  const existingAriaLabel = props['aria-label'];
  return <pre {...props} aria-label={existingAriaLabel ?? ariaLabel} />;
}

/*
 * Open off-site links in a new tab, matching the convention the site
 * chrome already follows (footer GitHub link, work-page external links).
 * Internal/relative links keep default navigation so readers don't lose
 * back-button behavior inside the site.
 */
function ContentLink(props: ComponentPropsWithoutRef<'a'>) {
  const isExternal = typeof props.href === 'string' && /^https?:\/\//.test(props.href);
  if (!isExternal) return <a {...props} />;
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlockPre,
    a: ContentLink,
    /*
     * Every MDX image — markdown `![]()` and author-written `<img>` alike —
     * opens fullsize in a lightbox on tap/click (#231).
     */
    img: LightboxImage,
  };
}
