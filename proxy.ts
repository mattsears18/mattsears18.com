import { NextRequest, NextResponse } from 'next/server';

/*
 * Per-request CSP nonce — see #38.
 *
 * Next.js 16's App Router streams Server Components by emitting a stream of
 * inline `<script>self.__next_f.push(...)</script>` tags whose contents vary
 * per route, so a static hash-pinned CSP in `next.config.js` cannot allow
 * them. The canonical fix from the Next.js docs is to set the CSP from a
 * proxy with a per-request nonce and `'strict-dynamic'`; Next.js then
 * auto-stamps that nonce onto every framework-emitted `<script>` and
 * `<style>` during SSR, and `'strict-dynamic'` lets those allowlisted
 * scripts load further chunks without listing them individually.
 *
 * Trade-off: the proxy forces dynamic rendering, so pages can't be served
 * straight from the static prerender cache. For a low-traffic portfolio,
 * the perf cost is negligible; the CDN still caches at the edge.
 *
 * The other four security headers (X-Frame-Options, X-Content-Type-Options,
 * Referrer-Policy, Permissions-Policy) stay in `next.config.js` because they
 * don't need per-request data and `headers()` there applies to every
 * response — including the static asset paths excluded from this proxy's
 * matcher.
 *
 * Vercel Toolbar (loaded only when VERCEL_ENV !== 'production' — see
 * app/layout.tsx) pulls runtime assets from vercel.live and opens a
 * websocket to *.pusher.com; allowlisted only on non-production deploys.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isProduction = process.env.VERCEL_ENV === 'production';
  const isDev = process.env.NODE_ENV === 'development';

  const csp = [
    `default-src 'self'`,
    // 'strict-dynamic' propagates the nonce to scripts loaded by allowlisted
    // ones, so we don't need to enumerate every chunk URL.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}${isProduction ? '' : ' https://vercel.live'}`,
    // Tailwind compiles to <style> blocks bound to the layout; Next.js
    // auto-stamps the nonce onto those during SSR. Inline style attributes
    // on per-element JSX (e.g. layout.tsx's `style={{ colorScheme }}`) are
    // covered by 'unsafe-inline' in style-src-attr below.
    `style-src 'self' 'nonce-${nonce}'${isProduction ? '' : ' https://vercel.live'}`,
    // Per-element style="..." attributes used throughout the JSX. Browsers
    // that don't support style-src-attr fall back to style-src, which
    // does NOT include 'unsafe-inline' here — accept the modern-browser
    // narrowing as a feature, not a bug.
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' data: blob:${isProduction ? '' : ' https://vercel.live https://vercel.com'}`,
    `font-src 'self' data:${isProduction ? '' : ' https://vercel.live'}`,
    `connect-src 'self'${isProduction ? '' : ' https://vercel.live wss://ws-us3.pusher.com https://sockjs-us3.pusher.com'}`,
    `frame-src 'self'${isProduction ? '' : ' https://vercel.live'}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on every request path EXCEPT:
     *   - /_next/static/* and /_next/image/*  (static chunks + image opt;
     *     they don't render HTML and don't need a CSP)
     *   - /favicon.ico, /robots.txt, /sitemap.xml, /rss.xml (no scripts)
     *   - asset extensions served straight from /public
     *
     * Same exclusion list Next.js suggests in their CSP guide. The
     * route handler files (robots.ts, sitemap.ts, rss.xml/) generate
     * non-HTML responses where the CSP header has no security benefit;
     * skipping them keeps the proxy off the hot path for crawler
     * traffic and feed readers.
     */
    {
      source:
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|rss.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|otf|map)$).*)',
    },
  ],
};
