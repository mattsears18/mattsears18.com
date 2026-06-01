import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/app/components/json-ld';
import { breadcrumbListSchema } from '@/lib/json-ld';
import { defaultOpenGraph } from '@/lib/site';

const PRIVACY_DESCRIPTION =
  'How visitor data is handled on mattsears18.com — short, factual, and limited to what hosting infrastructure requires.';

export const metadata: Metadata = {
  title: 'Privacy',
  description: PRIVACY_DESCRIPTION,
  alternates: { canonical: '/privacy' },
  openGraph: {
    ...defaultOpenGraph,
    title: 'Privacy — Matt Sears',
    description: PRIVACY_DESCRIPTION,
    url: '/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy — Matt Sears',
    description: PRIVACY_DESCRIPTION,
  },
};

/**
 * `/privacy` — short, factual disclosure of what visitor data flows through
 * the site's hosting infrastructure. See #44.
 *
 * Scope intentionally narrow: this is a personal/portfolio site with no
 * analytics, no cookies, no accounts, and no contact form on-site. The only
 * data that touches anything is the inbound HTTP request itself, which
 * Vercel's CDN logs as part of normal operation. The notice exists so a
 * visitor can read what's happening end-to-end without having to infer it
 * from the Vercel and GitHub privacy policies.
 *
 * NOT a substitute for a formal Privacy Policy if the site ever grows
 * commercial scope (newsletter, paid product, account system). At that point
 * this page gets replaced with something a lawyer reviewed; in the meantime
 * disclosing what does happen is better than disclosing nothing.
 */
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-reading py-16 sm:py-20">
      <JsonLd
        schema={breadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: '/privacy' },
        ])}
      />

      <header className="mb-12 sm:mb-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-muted">Privacy</p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Privacy
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
          What happens to your data when you visit this site — short, factual, and limited to what
          hosting infrastructure requires.
        </p>
      </header>

      <div className="prose-post">
        <h2>What data this site collects directly</h2>
        <p>
          Nothing. There are no analytics scripts, no cookies, no tracking pixels, no contact form,
          and no accounts. Visiting any page sends no data to me beyond the HTTP request itself
          (described below).
        </p>

        <h2>What data the hosting infrastructure processes</h2>
        <p>
          The site is hosted on <a href="https://vercel.com">Vercel</a>, which operates the content
          delivery network (CDN) and runtime that serves every request. As part of normal
          infrastructure operation, Vercel processes the data that&apos;s inherent to any HTTP
          request:
        </p>
        <ul>
          <li>your IP address</li>
          <li>the URL you requested</li>
          <li>the time of the request</li>
          <li>your browser&apos;s user-agent string</li>
          <li>the HTTP referrer (the page you came from, if any)</li>
        </ul>
        <p>
          Vercel is the data processor for this information; I am the controller. Their handling is
          governed by{' '}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            Vercel&apos;s privacy policy
          </a>{' '}
          and{' '}
          <a
            href="https://vercel.com/legal/dpa"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            data processing addendum
          </a>
          .
        </p>

        <h2>Cookies</h2>
        <p>
          The site sets no cookies. If a future feature requires them (for example, a comment
          system, a contact form, or analytics) this page will be updated before that feature ships.
        </p>

        <h2>Error monitoring</h2>
        <p>
          Client-side and server-side errors are reported to <a href="https://sentry.io">Sentry</a>{' '}
          to help me find and fix bugs. Sentry receives the error itself (stack trace, browser
          version, the URL that triggered it) along with the IP address that initiated the request.
          Sentry is also a data processor for this site; their handling is governed by{' '}
          <a
            href="https://sentry.io/privacy/"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            Sentry&apos;s privacy policy
          </a>{' '}
          and{' '}
          <a
            href="https://sentry.io/legal/dpa/"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            data processing addendum
          </a>
          . Error events are processed on Sentry&apos;s US infrastructure; the EU&rarr;US transfer
          relies on EU Standard Contractual Clauses (SCCs) per Sentry&apos;s DPA.
        </p>

        <h2>External links</h2>
        <p>
          The site links out to GitHub, LinkedIn, and a small handful of other services. Once you
          follow a link, the destination&apos;s own privacy policy applies — I have no visibility
          into or control over how those services handle your visit.
        </p>

        <h2>Requesting deletion</h2>
        <p>
          If you&apos;d like Vercel&apos;s or Sentry&apos;s log entries for your visits removed,
          email me at{' '}
          <a
            href="mailto:matt@mksolutionsky.com"
            className="text-accent underline-offset-4 hover:underline"
          >
            matt@mksolutionsky.com
          </a>{' '}
          and I&apos;ll forward the request to the relevant processor. Retention is short by default
          (typically a few weeks for routine CDN logs), so most data ages out on its own.
        </p>

        <h2>Updates to this page</h2>
        <p>
          The site&apos;s source is{' '}
          <a
            href="https://github.com/mattsears18/mattsears18.com"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            on GitHub
          </a>{' '}
          — any change to this page is in the commit history. There&apos;s no separate &quot;last
          updated&quot; date because the git log is authoritative. The underlying processor
          inventory (the internal record this notice is based on) lives at{' '}
          <a
            href="https://github.com/mattsears18/mattsears18.com/blob/main/PRIVACY_DATA_PROCESSORS.md"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            PRIVACY_DATA_PROCESSORS.md
          </a>
          .
        </p>
      </div>

      <footer className="mt-20 border-t border-border pt-8">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
        >
          ← Back home
        </Link>
      </footer>
    </article>
  );
}
