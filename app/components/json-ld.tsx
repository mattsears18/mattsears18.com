import { headers } from 'next/headers';

/**
 * Render a `<script type="application/ld+json">` tag with the per-request
 * CSP nonce stamped on — required by the strict-dynamic CSP set in
 * `proxy.ts`. Without the nonce, browsers reject the inline script and
 * search engines never see the structured data.
 *
 * SAFETY: The script payload is built from schema objects authored in
 * `lib/json-ld.ts` (Person, WebSite, BreadcrumbList) — every string value
 * is a hard-coded constant or a value derived from controlled sources
 * (post frontmatter, project frontmatter, route slugs from
 * generateStaticParams). No request-derived data, no fetched JSON, no
 * user-submitted input ever enters the payload. The use of
 * `dangerouslySetInnerHTML` is therefore safe by construction; an
 * attacker would need write access to the schema generators or the MDX
 * frontmatter to influence it, both of which are repo-controlled.
 *
 * Defense in depth: `JSON.stringify` escapes JSON-syntactic characters,
 * and we additionally replace `<` with `<` so any future schema value
 * containing a `</script>` substring cannot terminate the script tag
 * early. JSON parsers treat the escape identically; HTML parsers never
 * see the bare `<`. Same pattern used by Next.js's own framework-emitted
 * inline scripts and by the existing `ThemeScript` component
 * (`app/components/theme-script.tsx`). A DOMPurify-style HTML sanitizer
 * is the wrong tool here — the payload is JSON, not HTML, and HTML
 * sanitization would corrupt valid schema content.
 *
 * Accepts a single schema object OR an array — passing an array emits one
 * `<script>` per schema, which is the recommended pattern (some validators
 * fail on a top-level array of schemas in a single script tag).
 */
type SchemaObject = Record<string, unknown>;

export async function JsonLd({ schema }: { schema: SchemaObject | SchemaObject[] }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, i) => {
        const json = JSON.stringify(s).replace(/</g, '\\u003c');
        // `react/no-danger` is not enabled by `eslint-config-next/core-web-vitals`,
        // so no per-line disable is needed. The safety reasoning for using
        // `dangerouslySetInnerHTML` here is documented in the file header.
        return (
          <script
            key={i}
            type="application/ld+json"
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: json }}
          />
        );
      })}
    </>
  );
}
