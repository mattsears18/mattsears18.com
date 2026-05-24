import Link from 'next/link';

import { ThemeToggle } from './theme-toggle';

/**
 * Top-of-page header. Minimal by design: name on the left as a home link,
 * primary nav (Work, Blog) in the middle/right, theme toggle on the far
 * right. Nav was held back until both routes existed (#10 added /blog,
 * #9 added /work) — adding them earlier would have been a worse signal
 * than omitting them.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-6 sm:px-12">
        <Link
          href="/"
          className="font-display text-base font-medium tracking-tight text-fg hover:text-accent"
        >
          Matt Sears
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/work"
            className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
          >
            Work
          </Link>
          <Link
            href="/blog"
            className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
          >
            Blog
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
