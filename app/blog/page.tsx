import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/app/components/json-ld';
import { breadcrumbListSchema } from '@/lib/json-ld';
import { formatPostDate, getAllPosts } from '@/lib/posts';

const BLOG_DESCRIPTION =
  'Writing on software engineering — systems, ops, and the work of leading teams that ship.';

export const metadata: Metadata = {
  title: 'Blog',
  description: BLOG_DESCRIPTION,
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Matt Sears',
    description: BLOG_DESCRIPTION,
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Matt Sears',
    description: BLOG_DESCRIPTION,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-reading py-16 sm:py-20">
      <JsonLd
        schema={breadcrumbListSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />
      <header className="mb-12 sm:mb-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-fg-muted">Writing</p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
          Notes on engineering practice — systems, operations, the work of leading teams that ship.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-fg-muted">
          Nothing here yet.{' '}
          <Link href="/" className="text-accent underline-offset-4 hover:underline">
            Back home →
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-border border-t border-border">
          {posts.map((post) => (
            <li key={post.slug} className="py-8 sm:py-10">
              <article>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="font-display text-2xl font-medium tracking-tight text-fg group-hover:text-accent sm:text-3xl">
                    {post.frontmatter.title}
                  </h2>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-fg-muted">
                    <time dateTime={post.frontmatter.date}>
                      {formatPostDate(post.frontmatter.date)}
                    </time>
                  </p>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                    {post.frontmatter.excerpt}
                  </p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
