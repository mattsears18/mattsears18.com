import Link from 'next/link';

import { Button } from '@/components/ui/button';

/**
 * Landing page — hero + brief about. Build slice #8.
 *
 * Copy is intentionally generic-but-credible: it's true for any senior eng
 * with a few years of shipping experience. Replace the TODO-marked spans
 * with personal specifics (location, years, specialty stack) post-merge.
 */
export default function Home() {
  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="flex min-h-[70vh] flex-col justify-center py-16 sm:py-24 lg:min-h-[78vh]"
      >
        <p className="mb-6 font-mono text-sm uppercase tracking-widest text-fg-muted">
          Matt Sears
        </p>

        <h1
          id="hero-heading"
          className="max-w-3xl font-display text-display-sm font-medium tracking-tight text-fg sm:text-display-md lg:text-display-lg"
        >
          Senior software engineer who ships reliable systems
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
          I build dependable backends, sharp interfaces, and the teams that keep
          them shipping. {/* TODO(matt): personalize — e.g. "Based in <city>." or "Currently leading platform at <company>." */}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href="mailto:matt@mksolutionsky.com">Get in touch</a>
          </Button>
          <Button asChild size="lg" variant="ghost">
            {/* /work doesn't exist yet — ships in #9. Will 404 until then. */}
            <Link href="/work">See my work</Link>
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="about-heading"
        className="border-t border-border py-16 sm:py-20"
      >
        <h2 id="about-heading" className="sr-only">
          About
        </h2>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
            About
          </p>
          <div className="max-w-reading space-y-6 text-base leading-relaxed text-fg sm:text-lg">
            <p>
              I&apos;ve spent the last several years writing code, reviewing
              other people&apos;s code, and figuring out why production stopped
              working at 2am. The throughline: small, debuggable systems beat
              clever ones, and a team that can read each other&apos;s diffs out-ships
              a team that can&apos;t.
            </p>
            <p>
              I write about engineering practice — testing, architecture
              decisions, the bits of build tooling that nobody else wants to
              own. Occasional notes on the side projects too.
            </p>
            <p className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {/* /blog doesn't exist yet — ships in #10. Will 404 until then. */}
              <Link
                href="/blog"
                className="text-accent underline-offset-4 hover:underline"
              >
                Read the blog →
              </Link>
              <a
                href="https://github.com/mattsears18"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                View on GitHub →
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
