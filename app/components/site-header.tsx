import Link from 'next/link';

import { ThemeToggle } from './theme-toggle';

/**
 * Top-of-page header. Minimal by design: name on the left as a home link,
 * theme toggle on the right. Nav links land in #10 / #9 when the /blog and
 * /work routes exist — adding them here while they 404 would be a worse
 * signal than omitting them.
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
        <ThemeToggle />
      </div>
    </header>
  );
}
