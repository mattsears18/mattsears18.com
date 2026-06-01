import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/app/components/json-ld';
import { articleSchema, breadcrumbListSchema } from '@/lib/json-ld';
import { formatPostDate, getAllPosts, getPostBySlug } from '@/lib/posts';
import { defaultOpenGraph, SITE_TITLE } from '@/lib/site';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonical = `/blog/${slug}`;
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    authors: [{ name: SITE_TITLE }],
    alternates: { canonical },
    openGraph: {
      ...defaultOpenGraph,
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: 'article',
      url: canonical,
      publishedTime: post.frontmatter.date,
      authors: [SITE_TITLE],
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { default: MDXContent } = await import(`@/content/posts/${slug}.mdx`);

  return (
    <article className="mx-auto max-w-reading py-12 sm:py-16">
      <JsonLd
        schema={[
          breadcrumbListSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.frontmatter.title, path: `/blog/${slug}` },
          ]),
          articleSchema({
            title: post.frontmatter.title,
            excerpt: post.frontmatter.excerpt,
            date: post.frontmatter.date,
            slug,
          }),
        ]}
      />
      <nav className="mb-10">
        <Link
          href="/blog"
          className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
        >
          ← Back to blog
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl lg:text-display-sm">
          {post.frontmatter.title}
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-fg-muted">
          <time dateTime={post.frontmatter.date}>{formatPostDate(post.frontmatter.date)}</time>
        </p>
      </header>

      <div className="prose-post">
        <MDXContent />
      </div>

      <footer className="mt-20 border-t border-border pt-8">
        <Link
          href="/blog"
          className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-accent"
        >
          All posts →
        </Link>
      </footer>
    </article>
  );
}
