'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

/*
 * Click-to-zoom for images (#231). Two entry points share one overlay:
 *
 * - `LightboxImage` — drop-in `<img>` replacement wired up as the `img`
 *   mapping in `mdx-components.tsx`, so every image in post/work MDX
 *   (markdown `![]()` and author-written `<img>`) opens fullscreen on
 *   tap/click without changing its inline layout.
 * - `LightboxTrigger` — wraps an arbitrary visual (e.g. the work-page hero,
 *   which renders through `next/image`) in a `<button>` that opens the same
 *   overlay for a given `src`.
 *
 * The overlay image is constrained by `max-h-full max-w-full` inside a
 * `fixed inset-0` container, so it re-fits automatically when the viewport
 * changes — rotating a phone to landscape resizes the image with no JS
 * measurement needed.
 */

type OverlayProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

function LightboxOverlay({ src, alt, onClose }: OverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      // Single focusable element in the dialog — keep Tab from escaping to
      // the page underneath while the overlay is up.
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Full-size image'}
      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-3 sm:p-6"
      onClick={onClose}
    >
      {/* Tapping anywhere — image included — dismisses, so no stopPropagation. */}
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close full-size image"
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-2xl leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>,
    document.body,
  );
}

/*
 * Restores focus to the trigger when the overlay closes. Kept out of
 * `LightboxOverlay` so the overlay stays ignorant of what opened it.
 */
function useLightbox<T extends HTMLElement>() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<T>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return { open, setOpen, close, triggerRef };
}

export function LightboxImage(props: ComponentPropsWithoutRef<'img'>) {
  const { open, setOpen, close, triggerRef } = useLightbox<HTMLImageElement>();
  const { alt = '', ...rest } = props;

  const src = typeof props.src === 'string' ? props.src : undefined;
  if (!src) return <img alt={alt} {...rest} />;

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLImageElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <>
      {/*
       * The handlers live on the <img> itself (rather than a wrapping
       * <button>) so author-supplied layout — width percentages in MDX flex
       * rows, prose styles — applies to the exact same element it did
       * before the lightbox existed.
       */}
      <img
        alt={alt}
        {...rest}
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        onKeyDown={onTriggerKeyDown}
        style={{ cursor: 'zoom-in', ...props.style }}
      />
      {open ? <LightboxOverlay src={src} alt={alt} onClose={close} /> : null}
    </>
  );
}

type TriggerProps = {
  src: string;
  alt: string;
  className?: string;
  children: ReactNode;
};

export function LightboxTrigger({ src, alt, className, children }: TriggerProps) {
  const { open, setOpen, close, triggerRef } = useLightbox<HTMLButtonElement>();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`View full-size image: ${alt}`}
        className={['block w-full cursor-zoom-in', className ?? ''].filter(Boolean).join(' ')}
      >
        {children}
      </button>
      {open ? <LightboxOverlay src={src} alt={alt} onClose={close} /> : null}
    </>
  );
}
