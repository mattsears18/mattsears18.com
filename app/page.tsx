import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SITE_TAGLINE, SITE_TITLE } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_TAGLINE,
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_TAGLINE,
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_TAGLINE,
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
          className="max-w-3xl font-display text-display-sm font-medium tracking-tight text-fg sm:text-display-md lg:text-display-lg"
        >
          Software engineer with a civil engineering PhD
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
          I lead engineering at SalesRiver, sit on the board of a Kentucky social enterprise, and
          build Shipyard and Lightwork on nights and weekends.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href="mailto:matt@mksolutionsky.com">Get in touch</a>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/work">See my work</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="about-heading" className="border-t border-border py-16 sm:py-20">
        <h2 id="about-heading" className="sr-only">
          About
        </h2>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">About</p>
          <div className="max-w-reading space-y-6 text-base leading-relaxed text-fg sm:text-lg">
            <p>
              I came up through civil engineering — undergrad at Eastern Kentucky, a few years on
              $40M–$200M industrial site designs, then a PhD at CU Boulder on how construction craft
              workers read 2D drawings. Seven peer-reviewed papers came out of it, an artificial
              neural network now used statewide by the Colorado DOT, and an open-source eye-tracking
              app that&apos;s still cited.
            </p>
            <p>
              I left academia for software in 2019. At NCCER I owned Single Sign-On across the
              entire customer-facing surface. At SalesRiver I lead a team of six and took the
              platform from Seed through Series A — including a consolidation of ten single-tenant
              apps into one multi-tenant SaaS in a single hour of scheduled downtime, a 60% cut in
              AWS infrastructure costs via Terraform, and a white-label transformation that drove
              $800K+ in new ARR.
            </p>
            <p>
              Off-hours I serve on the board of{' '}
              <a
                href="https://www.enrichky.com/"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                Enrich
              </a>
              , a Madison County, KY social enterprise that employs people with alternative resumes
              — recovery, homelessness, reentry. I&apos;m also building Shipyard (a Claude Code
              plugin that autonomously works a GitHub issue backlog) and Lightwork (a
              volunteer-coordination app for community organizations). Most of this portfolio site
              was built by Shipyard, not by me.
            </p>
            <p className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              <Link href="/blog" className="text-accent underline-offset-4 hover:underline">
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
              <a
                href="https://www.linkedin.com/in/mattsears18/"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline-offset-4 hover:underline"
              >
                LinkedIn →
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
