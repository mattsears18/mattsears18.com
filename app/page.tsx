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
          I build software at Hudl, sit on the board of a Kentucky social enterprise, and build
          Shipyard and Lightwork on nights and weekends.
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
          <p className="text-fg-muted font-mono text-xs uppercase tracking-widest">About</p>
          <div className="max-w-reading text-fg space-y-6 text-base leading-relaxed sm:text-lg">
            <p>
              I came up through construction before civil engineering: a construction management
              degree and a few years managing water treatment plant builds, then a civil engineering
              degree and a few years designing $40M–$200M industrial facilities, before a PhD at CU
              Boulder. The product habit started early. Along the way I founded DirtPlan, a
              construction-submittal SaaS that I built solo and sold in 2016. The PhD itself was
              user research at heart — I put eye tracking glasses on pipefitters to understand how
              they extract information from construction drawings, built an open-source app to
              analyze the data, and published seven peer-reviewed papers. A neural network I built
              for the Colorado DOT still estimates highway construction durations statewide.
            </p>
            <p>
              I moved into software full-time in 2019, and the job has stayed the same ever since:
              talk to users, watch the data, own the feature from the first conversation through
              deploy and the production monitoring that keeps it healthy. At NCCER I ran focus
              groups with construction craft professionals, built the analytics stack the executives
              ran on, and shipped Single Sign-On across every customer-facing app — the feature our
              users asked for most, by a wide margin. At SalesRiver I led a team of six engineers
              from Seed through Series A. White-labeling the platform unlocked $800K+ in new ARR —
              and spun up ten single-tenant apps that we later consolidated into one multi-tenant
              SaaS in a single hour of scheduled downtime, zero incidents. Today I build at Hudl,
              working full-stack across web and mobile.
            </p>
            <p>
              Off-hours I serve on the board of{' '}
              <a
                href="https://www.enrichky.com/"
                target="_blank"
                rel="noreferrer"
                className="text-accent decoration-accent/40 hover:decoration-accent inline-block py-0.5 underline underline-offset-4"
              >
                Enrich
              </a>
              , a Madison County, KY social enterprise that employs people with alternative resumes
              — recovery, homelessness, reentry. I&apos;m also building{' '}
              <Link
                href="/work/shipyard"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                Shipyard
              </Link>{' '}
              (a Claude Code plugin that autonomously works a GitHub issue backlog) and{' '}
              <Link
                href="/work/lightwork"
                className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-4"
              >
                Lightwork
              </Link>{' '}
              (a volunteer-coordination app for community organizations). Most of this portfolio
              site was built by Shipyard, not by me.
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
