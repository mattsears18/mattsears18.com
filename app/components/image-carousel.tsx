'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { LightboxImage } from '@/app/components/lightbox-image';

type Slide = {
  src: string;
  alt: string;
};

type Props = {
  slides: Slide[];
  /** Accessible name for the whole carousel region. */
  label: string;
};

/*
 * Horizontal scroll-snap carousel for tall screenshots (#231 follow-up).
 * Native scrolling does the heavy lifting — swipe works on touch with zero
 * JS — while the chevrons and dots add pointer/keyboard navigation. Each
 * slide renders through LightboxImage, so tapping a screenshot still opens
 * it fullsize like every other image on the site.
 */
export function ImageCarousel({ slides, label }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Track which slide's center is nearest the viewport center so the dots
  // stay in sync with free-form swiping, not just button navigation.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const center = el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(center - trackCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }
    });
    setIndex(nearest);
  }, []);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  const scrollTo = useCallback((i: number) => {
    const track = trackRef.current;
    const child = track?.children[i] as HTMLElement | undefined;
    if (!track || !child) return;
    track.scrollTo({
      left: child.offsetLeft - (track.clientWidth - child.offsetWidth) / 2,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label} className="my-8">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-min(34vw,130px))] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide) => (
            <div key={slide.src} className="w-[min(68vw,260px)] shrink-0 snap-center">
              <LightboxImage
                src={slide.src}
                alt={slide.alt}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: '1px solid rgba(128, 128, 128, 0.35)',
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          aria-label="Previous screenshot"
          disabled={index === 0}
          onClick={() => scrollTo(index - 1)}
          className="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated/90 text-xl text-fg shadow-sm transition-opacity disabled:opacity-0 sm:left-2"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <button
          type="button"
          aria-label="Next screenshot"
          disabled={index === slides.length - 1}
          onClick={() => scrollTo(index + 1)}
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-elevated/90 text-xl text-fg shadow-sm transition-opacity disabled:opacity-0 sm:right-2"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to screenshot ${i + 1} of ${slides.length}`}
            aria-current={i === index ? 'true' : undefined}
            onClick={() => scrollTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === index ? 'bg-accent' : 'bg-fg-muted/40 hover:bg-fg-muted/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
