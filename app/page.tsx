import type { Metadata } from 'next';
import Link from 'next/link';

import { GetInTouchButton } from '@/components/get-in-touch-button';
import { Button } from '@/components/ui/button';
import { defaultOpenGraph, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    ...defaultOpenGraph,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="flex min-h-[70vh] flex-col justify-center py-16 sm:py-24 lg:min-h-[78vh]"
      >
        <h1
          id="hero-heading"
          className="font-display text-display-sm text-fg sm:text-display-md lg:text-display-lg max-w-3xl font-medium tracking-tight"
        >
          Product engineer with a civil engineering PhD
          <span className="text-accent">.</span>
        </h1>

        <p className="text-fg-muted mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
          I find what&apos;s painful, follow the data, and build the tool that fixes it — then keep
          iterating. Lately that&apos;s developer tooling, including{' '}
          <Link
            href="/work/shipyard"
            className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
          >
            Shipyard
          </Link>
          : the agent that builds and ships the CI/CD behind the products I make.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <GetInTouchButton />
          <Button asChild size="lg" variant="ghost">
            <Link href="/work">See my work</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="about-heading" className="border-border border-t py-16 sm:py-20">
        <h2 id="about-heading" className="sr-only">
          About
        </h2>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <p className="text-fg-muted font-mono text-xs tracking-widest uppercase">About</p>
          <div className="max-w-reading text-fg space-y-6 text-base leading-relaxed sm:text-lg">
            <p>
              I&apos;m a product engineer, and I mean something specific by that: I find what&apos;s
              painful for people, dig into the data, design and build something that solves it, then
              keep iterating until it genuinely fits. That&apos;s been the shape of nearly all my
              work. These days I&apos;m most alive building tools for other developers — I&apos;m a
              little obsessed with developer experience — and the tool I lean on hardest is my own:{' '}
              <Link
                href="/work/shipyard"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                Shipyard
              </Link>
              , which builds and runs the CI/CD pipelines behind the user-facing products I ship.
            </p>
            <p>
              The product instinct started early, and far from a keyboard. I came up through
              construction before civil engineering — a few years managing water treatment plant
              builds, then designing $40M–$200M industrial facilities — before a PhD at CU Boulder
              that was really user research: I put eye tracking glasses on pipefitters to understand
              how they extract information from construction drawings, built{' '}
              <a
                href="https://www.npmjs.com/package/time-hulls"
                target="_blank"
                rel="noreferrer"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                time-hulls
              </a>{' '}
              and{' '}
              <Link
                href="/work/visual-eyes"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                VisualEyes
              </Link>{' '}
              (open-source) to analyze the data, and published{' '}
              <a
                href="https://scholar.google.com/citations?user=XglzLYcAAAAJ&hl=en"
                target="_blank"
                rel="noreferrer"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                seven peer-reviewed papers
              </a>
              . Along the way I built and sold DirtPlan, a construction-submittal SaaS, solo.
            </p>
            <p>
              I moved into software full-time in 2019, and the job hasn&apos;t really changed since:
              talk to users, watch the data, own the feature from the first conversation through
              deploy and the production monitoring that keeps it healthy. At NCCER I ran focus
              groups with construction craft professionals, built the analytics stack the executives
              ran on, and shipped Single Sign-On across four user-facing apps — the feature our
              users asked for most, by a wide margin. At SalesRiver I led six engineers from Seed
              through Series A — white-labeling the platform unlocked $800K+ in new ARR and spun up
              ten single-tenant apps we later consolidated into one multi-tenant SaaS in a single
              hour of scheduled downtime, zero incidents. Today I build full-stack at Hudl, across
              web and mobile.
            </p>
            <p>
              Most of my favorite projects began as tools I built for myself — Shipyard,{' '}
              <Link
                href="/work/lightwork"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                Lightwork
              </Link>
              , DirtPlan,{' '}
              <Link
                href="/work/express-delphi"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                Express Delphi
              </Link>
              , and VisualEyes. I used to love platform engineering and hand-rolling DevOps; now
              that so much of it can be automated, I&apos;d rather build the thing that does the
              automating. Off-hours I serve on the board of{' '}
              <a
                href="https://www.enrichky.com/"
                target="_blank"
                rel="noreferrer"
                className="text-accent decoration-accent/40 hover:decoration-accent inline-block py-0.5 underline underline-offset-4"
              >
                Enrich
              </a>
              , a Madison County, KY social enterprise that employs people with alternative resumes
              — recovery, homelessness, reentry. Most of this site, fittingly, was built by Shipyard
              rather than by me.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              <Link
                href="/blog"
                className="text-accent inline-flex min-h-[44px] items-center underline-offset-4 hover:underline"
              >
                Read the blog →
              </Link>
              <a
                href="https://github.com/mattsears18"
                target="_blank"
                rel="noreferrer"
                className="text-accent inline-flex min-h-[44px] items-center underline-offset-4 hover:underline"
              >
                View on GitHub →
              </a>
              <a
                href="https://www.linkedin.com/in/mattsears18/"
                target="_blank"
                rel="noreferrer"
                className="text-accent inline-flex min-h-[44px] items-center underline-offset-4 hover:underline"
              >
                LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
