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
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
]);
