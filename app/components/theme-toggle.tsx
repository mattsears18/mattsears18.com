'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/**
 * Theme toggle button. Reads initial state from the DOM (set by ThemeScript
 * before hydration), then writes user-driven changes to localStorage + the
 * `.dark` class on <html>.
 *
 * Intentionally minimal — no animation, no dropdown of three states. Two
 * modes, one click, persistent. Accessibility: aria-pressed reflects "dark
 * mode is currently on"; sr-only label gives screen readers the action.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Read the post-ThemeScript state on mount so SSR markup and client agree.
  // The `setState` call inside the effect is intentional: ThemeScript writes
  // the `.dark` class to <html> during HTML parse (before hydration), and we
  // need to mirror that DOM state into React state exactly once on mount.
  // Using `useSyncExternalStore` would be overkill — the DOM class only
  // changes in response to this component's own `apply()` calls after mount.
  useEffect(() => {
    const current: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot init mirror; see comment above.
    setTheme(current);
  }, []);

  const apply = (next: Theme) => {
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // localStorage can throw in privacy modes; theme still applies for the session.
    }
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = next;
  };

  // Render a placeholder during the first paint to avoid hydration mismatch.
  // The button still occupies space so the header layout doesn't jump.
  if (theme === null) {
    return (
      <button
        type="button"
        aria-label="Toggle color theme"
        className="h-9 w-9 rounded-md border border-border"
        // The real handler is wired up on mount.
        disabled
      />
    );
  }

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={() => apply(isDark ? 'light' : 'dark')}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg-muted transition-colors hover:border-accent hover:text-fg focus-visible:text-fg"
    >
      {/* Sun (shown in dark mode — click to go light) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 ${isDark ? 'block' : 'hidden'}`}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      {/* Moon (shown in light mode — click to go dark) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 ${isDark ? 'hidden' : 'block'}`}
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}
