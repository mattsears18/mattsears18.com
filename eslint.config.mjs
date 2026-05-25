/*
 * Flat ESLint config. Replaces `.eslintrc.json` + `next lint`, which were
 * removed in Next.js 16 (https://nextjs.org/docs/app/guides/upgrading/version-16).
 * Tracked in #80.
 *
 * `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
 * are flat-config presets shipped by `eslint-config-next` v16+. No
 * `@eslint/eslintrc` / `FlatCompat` shim needed.
 */
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  /*
   * Scope the TypeScript preset to TS files. Several entries in
   * `eslint-config-next/typescript` (notably `typescript-eslint/recommended`)
   * ship without a `files` glob, so spreading the preset as-is applies
   * TS-only rules like `@typescript-eslint/no-require-imports` to plain JS
   * files (e.g. `next.config.js`) and produces false-positive errors.
   */
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    extends: [...nextTs],
  },
  /*
   * Pin React version explicitly. `eslint-config-next` defaults
   * `settings.react.version` to "detect", which under ESLint 10 triggers a
   * crash in `eslint-plugin-react@7.37.5`'s version-detection path
   * (`contextOrFilename.getFilename is not a function` — that API was
   * removed in ESLint 9). Setting a concrete version short-circuits the
   * broken path. Bump this when the React major changes.
   */
  {
    settings: {
      react: { version: '19' },
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/**',
    'node_modules/**',
  ]),
]);

export default eslintConfig;
