import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Mirror the `@/*` -> `./` path alias from `tsconfig.json` so route handlers
  // and the modules they import (`@/lib/site`, `@/lib/posts`, `@/lib/work`)
  // resolve under Vitest. Without this, `app/**` specs that import a route
  // handler fail at module resolution. See #155.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    // `lib/**` covers the data-reader specs; `app/**` covers the public
    // route-handler specs (`rss.xml`, `llms.txt`, `sitemap.xml`, `robots.txt`).
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx', 'app/**/*.test.ts', 'app/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['lib/**/*.{ts,js}', 'app/**/route.{ts,js}'],
      exclude: ['lib/**/*.test.{ts,tsx}', 'app/**/*.test.{ts,tsx}'],
    },
  },
});
