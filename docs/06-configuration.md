# 06 - Configuration Guide

The framework keeps configuration in four files: Cypress, TypeScript, ESLint and Prettier.

---

## Cypress (`cypress.config.ts`)

```typescript
import { defineConfig } from 'cypress';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';
import initPlugin from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
  expose: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://www.saucedemo.com',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      cypressGrepPlugin(config);
      return config;
    },
    retries: {
      runMode: 1,
      openMode: 0,
    },
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'reports',
      charts: true,
      reportPageTitle: 'AutoVD Cypress Report',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
  },
});
```

Key decisions:

- `CYPRESS_BASE_URL` overrides the target without a code change.
- `retries.runMode: 1` absorbs one network hiccup without hiding a consistently flaky test.
- Component testing is not configured. Add it only when the project has a component test setup.
- `chromeWebSecurity` is left at its default. Disable it only for a documented cross-origin requirement.

---

## Environment variables

Cypress reads `CYPRESS_*` variables from the shell/CI:

```bash
CYPRESS_BASE_URL=https://staging.example.com npm test
```

The base URL has one source of truth in `cypress.config.ts`. Do not duplicate it in `cypress.env.json`.

If you need additional app values later, read them with `Cypress.env('API_URL')` and document the variable in `README.md` and CI secrets.

---

## Tag filtering (`@cypress/grep`)

Configuration is split between the config file and the CLI:

```typescript
// cypress.config.ts
expose: {
  grepFilterSpecs: true,
  grepOmitFiltered: true,
},
```

```bash
cypress run --expose grepTags=@smoke
```

- `grepFilterSpecs` skips loading specs that contain no matching test.
- `grepOmitFiltered` removes non-matching tests from the report instead of marking them pending.
- Tags are attached with test options: `it('...', { tags: '@smoke' }, () => {})`.

Useful commands:

```bash
npx cypress run --expose grepTags=@smoke
npx cypress run --expose grepTags="@smoke+-@slow"
npx cypress run --expose grep="checkout"
```

---

## TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "node16",
    "moduleResolution": "node16",
    "lib": ["ES2020", "DOM"],
    "types": ["cypress", "node"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["cypress/**/*.ts", "cypress.config.ts"],
  "exclude": ["node_modules", "reports"]
}
```

`module`/`moduleResolution` are `node16` so package `exports` resolve correctly for `@cypress/grep` and the reporter.

`resolveJsonModule` allows fixtures to be imported with full type inference:

```typescript
import * as users from '../../fixtures/saucedemo/users.json';
```

---

## ESLint (`eslint.config.mjs`)

ESLint 10 uses flat config:

```javascript
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  {
    ignores: [
      'node_modules/**',
      'reports/**',
      'cypress/videos/**',
      'cypress/screenshots/**',
      'cypress/downloads/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['cypress/**/*.ts'],
    extends: [cypress.configs.recommended],
    rules: {
      'cypress/no-unnecessary-waiting': 'error',
    },
  },
  {
    files: ['cypress/**/*.ts', 'cypress.config.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
]);
```

Prettier is enforced by `npm run format:check`, not by an ESLint rule. Keep formatting and linting separate.

---

## Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

`.prettierignore` excludes dependencies, reports, videos, screenshots and the lockfile.

---

## Scripts

```bash
npm run verify        # type-check + lint + format check
npm run type-check    # tsc --noEmit
npm run lint          # ESLint
npm run lint:fix      # ESLint autofix
npm run format        # Prettier write (code/config only)
npm run format:check  # Prettier check
```

CI runs `npm run verify` before Cypress, so a type, lint or formatting failure blocks the test run.
