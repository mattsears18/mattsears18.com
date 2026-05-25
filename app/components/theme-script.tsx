/**
 * Inline script injected into <head> to apply the persisted theme before
 * first paint. Without this, the page would flash light-mode for one frame
 * on dark-preferring users (FOUC). React hydration is too late — this runs
 * synchronously during HTML parse.
 *
 * SAFETY: The injected string is a hard-coded constant — no user input,
 * no template interpolation, no fetched data. This is the canonical
 * Next.js no-flash-theme pattern (same shape used by `next-themes`). The
 * `dangerouslySetInnerHTML` use is therefore safe by construction; the
 * payload cannot become attacker-controlled without editing this file.
 *
 * Order of precedence:
 *   1. `localStorage.theme` if set (user has clicked the toggle)
 *   2. `prefers-color-scheme: dark` media query
 *   3. Fall through to dark (the design default)
 */
const THEME_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (prefersDark ? 'dark' : 'dark');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }
})();`;

export function ThemeScript({ nonce }: { nonce?: string }) {
  const innerHTML = { __html: THEME_SCRIPT };
  // `react/no-danger` is not enabled by `eslint-config-next/core-web-vitals`,
  // so no per-line disable is needed. The safety reasoning for using
  // `dangerouslySetInnerHTML` here is documented in the file header.
  return <script nonce={nonce} dangerouslySetInnerHTML={innerHTML} />;
}
