import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { headers } from 'next/headers';
import { VercelToolbar } from '@vercel/toolbar/next';

import './globals.css';
import { JsonLd } from './components/json-ld';
import { ThemeScript } from './components/theme-script';
import { SiteHeader } from './components/site-header';
import { SiteFooter } from './components/site-footer';
import { personSchema, websiteSchema } from '@/lib/json-ld';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/site';

/*
 * Font setup — see docs/design.md for the role table.
 *   - Geist Sans  → display + UI            (via the `geist` package)
 *   - Inter       → body                    (next/font/google, self-hosted)
 *   - Source Serif 4 → long-form / blog     (next/font/google, self-hosted)
 *   - JetBrains Mono → code / mono accents  (next/font/google, self-hosted)
 *
 * Each exposes a CSS variable that Tailwind references via theme.extend.fontFamily.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

/*
 * Site-wide metadata. Per-route files override the title/description and
 * provide route-specific openGraph/twitter overrides; everything else
 * (metadataBase, siteName, default OG image via convention) is inherited.
 *
 * The OG/Twitter images are picked up by Next.js automatically from the
 * `app/opengraph-image.tsx` / `app/twitter-image.tsx` route files (and any
 * matching files in nested route segments). We do NOT enumerate them here.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  authors: [{ name: SITE_TITLE, url: SITE_URL }],
  creator: SITE_TITLE,
  publisher: SITE_TITLE,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${SITE_TITLE} — RSS` }],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Toolbar is gated on VERCEL_ENV: shows on preview + development, hidden on
  // production. Visitors never saw it anyway (auth-gated), but this kills the
  // overlay for signed-in team members on the production deploy too.
  const showVercelToolbar = process.env.VERCEL_ENV !== 'production';

  // CSP nonce — see proxy.ts. Stamped onto the one inline <script> we
  // emit (theme pre-paint); Next.js auto-stamps it onto its own framework
  // scripts and the next/font-generated <style> blocks during SSR.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html
      lang="en"
      // Dark default — the inline ThemeScript flips this to light pre-paint
      // if the user has chosen light, so the SSR markup is consistent.
      className={`dark ${GeistSans.variable} ${inter.variable} ${serif.variable} ${mono.variable}`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript nonce={nonce} />
        {/*
         * Site-wide Person + WebSite JSON-LD — see #58. The schemas describe
         * the site owner (Person → Knowledge Panel) and the site itself
         * (WebSite). BreadcrumbList is per-route, rendered by individual page
         * components against their depth in the URL hierarchy.
         */}
        <JsonLd schema={[personSchema(), websiteSchema()]} />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        {/*
         * Skip-to-main-content link — WCAG 2.1 AA 2.4.1 (Bypass Blocks).
         * Must be the first focusable element in the document so the very
         * first Tab keystroke surfaces it. Visually hidden with `sr-only`
         * until focused, then promoted to a fixed pill in the top-left.
         * Contrast on the focused state: `bg-bg` + `text-fg` is ~17:1 in
         * both light and dark themes (well above AA's 4.5:1). The site's
         * global `:focus-visible` rule layers an accent ring on top.
         */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-bg focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-medium focus:text-fg"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto max-w-container px-6 sm:px-12">
          {children}
        </main>
        <SiteFooter />
        {showVercelToolbar ? <VercelToolbar /> : null}
      </body>
    </html>
  );
}
