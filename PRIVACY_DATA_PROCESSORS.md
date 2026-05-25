# Privacy data processors

This file is the repo-side inventory for third-party services that may process personal data for `mattsears18.com`.

Keep it in sync with the production deployment and update it whenever a PR adds a new SDK, hosted service, or outbound browser/server integration.

## Active processors

| Processor | Purpose | Data processed | Activation / scope | DPA / privacy terms | Transfer mechanism |
| --- | --- | --- | --- | --- | --- |
| [Vercel](https://vercel.com/) | Hosting, CDN, build/deploy infrastructure | Visitor IP address, request metadata/logs, deployment/build metadata | Production hosting; preview/development when deployed on Vercel | https://vercel.com/legal/dpa | Standard Contractual Clauses (per Vercel DPA) |
| [Sentry](https://sentry.io/) | Error monitoring and performance tracing | Error events, stack traces, route/runtime metadata, sampled performance traces. `sendDefaultPii: false` is set in both browser and server configs, so IPs, headers, and user context are not auto-attached. | Only when `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` are configured | https://sentry.io/legal/dpa/ | Contractual protections documented in Sentry's DPA |

## Runtime notes

- `next/font/google` is used for `Inter`, `Source Serif 4`, and `JetBrains Mono` in `app/layout.tsx`, but Next.js self-hosts those fonts. The production site serves them from the site origin, so there is no runtime browser request to `fonts.googleapis.com` or `fonts.gstatic.com`.
- `@vercel/toolbar` is gated behind `process.env.VERCEL_ENV !== 'production'` in `app/layout.tsx`. It is a preview/development aid, not a production processor for public visitors.

## Update checklist

Before merging a PR that adds analytics, monitoring, auth, embeds, forms, or any other third-party integration:

1. Add or update the relevant row in this file.
2. Note whether the integration runs in production, preview only, server only, or client side.
3. Link the vendor's DPA or privacy terms.
4. Confirm whether the public privacy notice also needs an update.
