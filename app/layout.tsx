import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';

import './globals.css';
import { ThemeScript } from './components/theme-script';
import { SiteHeader } from './components/site-header';
import { SiteFooter } from './components/site-footer';

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

export const metadata: Metadata = {
  title: {
    default: 'Matt Sears',
    template: '%s — Matt Sears',
  },
  description:
    'Matt Sears — senior software engineer. Personal site, work, and writing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-bg text-fg">
        <SiteHeader />
        <main className="mx-auto max-w-container px-6 sm:px-12">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
