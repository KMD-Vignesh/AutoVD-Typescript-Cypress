# 06 - Configuration Guide

This document covers Cypress and TypeScript configuration for the AutoVD framework.

---

## Cypress Configuration (`cypress.config.ts`)

The Cypress configuration file is written in TypeScript and located at the project root.

---

## Cypress Configuration (`cypress.config.ts`)

The Cypress configuration file is written in TypeScript and located at the project root:

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URL for all visits
    baseUrl: 'https://example.com',

    // Default timeout for commands (in milliseconds)
    defaultCommandTimeout: 10000,

    // Timeout for page load events
    pageLoadTimeout: 60000,

    // Timeout for HTTP requests
    requestTimeout: 10000,

    // Where to find test specs
    specPattern: 'cypress/e2e/**/*.cy.ts',

    // Where to find support files
    setupNodeEvents(on, config) {
      // Register plugins, reporters, etc.
      return config;
    },

    // Video recording
    video: true,
    videoCompression: 32,

    // Screenshots on failure
    screenshotOnRunFailure: true,

    // Exclude spec files
    excludeSpecPattern: [],

    // Chrome Web Security
    chromeWebSecurity: false,

    // Retry attempts

---

## TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "types": ["cypress", "node"],
    "outDir": "./dist",
    "rootDir": ".",
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
  "include": ["cypress/**/*.ts", "cypress/**/*.tsx", "cypress.config.ts"],
  "exclude": ["node_modules", "dist", "reports"]
}
```

---

## ESLint Configuration (`.eslintrc.js`)

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:cypress/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'cypress', 'import', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'cypress/no-unnecessary-waiting': 'warn',
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'reports/'],
};
```

---

## Prettier Configuration (`.prettierrc`)

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

---

## Environment Variables

Create a `.env` file (not committed to git) for environment-specific configuration:

```env
CYPRESS_BASE_URL=https://staging.example.com
CYPRESS_API_URL=https://api.staging.example.com
CYPRESS_TIMEOUT=10000
```

Access them in tests via `Cypress.env('BASE_URL')` or `Cypress.env('API_URL')`.
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Environment variables
    env: {
      apiUrl: 'https://api.example.com',
      timeout: 10000,
    },
  },

  component: {
    // Component testing configuration (if needed)
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
});
```