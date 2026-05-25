'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';

const EMAIL = 'matt@mksolutionsky.com';
const RESET_MS = 2400;

/**
 * Hero CTA — copies the email to clipboard with visual confirmation and
 * also fires the mailto: navigation for users whose OS has a mail handler
 * registered. The clipboard path is the reliable one: a plain `mailto:`
 * silently no-ops for users without a default mail client (webmail-only
 * users, fresh OS installs, some mobile browsers), which is what made the
 * old hero button feel broken.
 */
export function GetInTouchButton() {
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle');
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Modifier-clicks fall through to the default mailto: handler so power
    // users keep cmd-click / middle-click behavior.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    event.preventDefault();

    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(EMAIL);
        copied = true;
      } catch {
        copied = false;
      }
    }

    setState(copied ? 'copied' : 'failed');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState('idle'), RESET_MS);

    // Fire mailto: AFTER the clipboard write so the clipboard succeeds even
    // when the mail handler steals focus. Using location.href instead of
    // window.open keeps it as a same-tab navigation that the browser will
    // either hand to a mail client or quietly drop.
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  const label =
    state === 'copied'
      ? `Email copied — ${EMAIL}`
      : state === 'failed'
        ? `Email: ${EMAIL}`
        : 'Get in touch';

  return (
    <Button asChild size="lg">
      <a
        href={`mailto:${EMAIL}`}
        onClick={handleClick}
        aria-live="polite"
        data-state={state}
      >
        {label}
      </a>
    </Button>
  );
}
