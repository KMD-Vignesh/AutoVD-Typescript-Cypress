# 01 - Installation Guide

This document covers the clean, original CLI-based installation of the AutoVD Cypress TypeScript framework. All steps use official package managers and official Cypress installation methods.

## Prerequisites

Before installing, ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 LTS or higher | https://nodejs.org/ |
| npm | Comes with Node.js | https://www.npmjs.com/ |
| Git | 2.x or higher | https://git-scm.com/ |

Verify your installation:

```bash
node --version      # v18.x.x or higher
npm --version       # 9.x.x or higher
git --version       # git version 2.x.x
```

---

## Step 1: Initialize the Project

Create a new directory and initialize a Node.js project with TypeScript support:

```bash
# Create project directory
mkdir AutoVD-Typescript-Cypress
cd AutoVD-Typescript-Cypress

# Initialize npm project (creates package.json)
npm init -y

# Install TypeScript as a development dependency
npm install --save-dev typescript
```

Verify TypeScript installation:

```bash
npx tsc --version
```

---

## Step 2: Install Cypress

Install Cypress using the official npm package (the recommended way):

```bash
npm install --save-dev cypress
```

Verify Cypress installation:

```bash
npx cypress --version
```

> **Why this way?** Installing Cypress via npm ensures you get the exact version pinned in your `package.json`, enabling reproducible installs across environments and CI/CD pipelines.

---

## Step 3: Install TypeScript & Supporting Tools

Install additional development dependencies for type safety, linting, and testing utilities:

```bash
# TypeScript
npm install --save-dev typescript

# Type definitions for Node.js (if needed for custom utils)
npm install --save-dev @types/node

# ESLint for code linting
npm install --save-dev eslint eslint-plugin-cypress eslint-plugin-import

# Prettier for code formatting
npm install --save-dev prettier eslint-config-prettier

# cypress-plugin-tab (optional: better tab command)
npm install --save-dev cypress-plugin-tab

# cypress-mochawesome-reporter (optional: rich HTML reports)
npm install --save-dev cypress-mochawesome-reporter mochawesome mochawesome-merge mochawesome-report-generator
```

---

## Step 4: Initialize TypeScript Configuration

Generate the TypeScript configuration file:

```bash
npx tsc --init
```

This creates a `tsconfig.json` file. Update it for strict type checking (see `docs/06-configuration.md` for the full recommended config).

---

## Step 5: Initialize Cypress Configuration

Create the Cypress configuration file. Cypress 10+ uses `cypress.config.ts` (TypeScript) or `cypress.config.js`:

```bash
# Create the config file manually or let Cypress scaffold it
npx cypress verify
```

> `cypress verify` ensures Cypress is installed correctly and can launch the browser.

---

## Step 6: Add npm Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "cypress:run:electron": "cypress run --browser electron",
    "lint": "eslint cypress/ --ext .ts",
    "lint:fix": "eslint cypress/ --ext .ts --fix",
    "format": "prettier --write cypress/",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Step 7: Clean Install (Reproducible)

For a clean installation from scratch (e.g., on a new machine or CI):

```bash
# Clone the repository
git clone <repository-url>
cd AutoVD-Typescript-Cypress

# Install all dependencies (uses package-lock.json for exact versions)
npm ci

# Verify installation
npx cypress verify
npx tsc --noEmit
```

> Use `npm ci` (clean install) instead of `npm install` in CI/CD for faster, more reliable, and reproducible dependency installation.

---

## Step 8: First Test Run

Open the Cypress Test Runner:

```bash
npm run cypress:open
```

Or run tests headlessly:

```bash
npm run cypress:run
```

---

## Dependency Summary

Here is the complete `package.json` for a fresh installation:

```json
{
  "name": "autovd-cypress-typescript",
  "version": "1.0.0",
  "description": "Scalable Cypress TypeScript Test Framework",
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "lint": "eslint cypress/ --ext .ts",
    "lint:fix": "eslint cypress/ --ext .ts --fix",
    "format": "prettier --write cypress/",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "cypress": "^13.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-cypress": "^2.0.0",
    "eslint-plugin-import": "^2.0.0",
    "prettier": "^3.0.0",
    "eslint-config-prettier": "^9.0.0",
    "cypress-mochawesome-reporter": "^3.0.0",
    "mochawesome": "^7.0.0",
    "mochawesome-merge": "^4.0.0",
    "mochawesome-report-generator": "^6.0.0"
  }
}
```

Install everything at once:

```bash
npm install --save-dev cypress typescript @types/node eslint eslint-plugin-cypress eslint-plugin-import prettier eslint-config-prettier cypress-mochawesome-reporter mochawesome mochawesome-merge mochawesome-report-generator
```

---

## Verification Checklist

- [ ] `node --version` returns 18+
- [ ] `npm --version` returns 9+
- [ ] `npx tsc --version` works
- [ ] `npx cypress --version` works
- [ ] `npx cypress verify` passes
- [ ] `npm run cypress:open` launches the Test Runner
- [ ] `npm run type-check` passes with no errors

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `cypress: command not found` | Run `npx cypress install` to download the Cypress binary |
| TypeScript compilation errors | Run `npx tsc --init` and check `tsconfig.json` |
| ESLint errors on Cypress globals | Install `eslint-plugin-cypress` and add it to `.eslintrc` |
| Permission errors on `npm install` | Use `nvm` or fix npm permissions; avoid `sudo npm install` |
