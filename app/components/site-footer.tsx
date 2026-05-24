/**
 * Page footer. Single line of attribution + source link, fg-muted.
 * Kept intentionally bare — no nav repetition, no social row, no copyright
 * year ceremony. Matches the editorial restraint called out in design.md.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-bg">
      <div className="mx-auto max-w-container px-6 py-8 sm:px-12">
        <p className="text-center text-sm text-fg-muted">
          Built by Matt Sears. View source on{' '}
          <a
            href="https://github.com/mattsears18/mattsears18.com"
            className="text-fg-muted underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
