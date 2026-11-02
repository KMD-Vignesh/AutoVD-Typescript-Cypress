# 01 - Installation Guide

Setup instructions for the AutoVD Cypress TypeScript framework.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 22 | Matches `.nvmrc`; required by Cypress 16 and `@cypress/grep` |
| npm | 10+ | Ships with Node 22 |
| Git | 2.x | Clone the repository |

```bash
node --version   # v22.x.x
npm --version    # 10.x.x
git --version
```

If you use `nvm`:

```bash
nvm use          # reads .nvmrc
```

---

## Install

```bash
git clone https://github.com/KMD-Vignesh/AutoVD-Typescript-Cypress.git
cd AutoVD-Typescript-Cypress
npm ci
```

`npm ci` installs exact versions from `package-lock.json` and also downloads the Cypress binary.

If the binary was skipped (for example on a restricted network):

```bash
npx cypress install
npx cypress verify
```

---

## Verify the setup

```bash
npm run verify     # type-check + lint + format check
npm run test:smoke # one tagged critical-path test
```

`npm run verify` must pass before you open the runner.

---

## Run tests

```bash
npm run test:open      # interactive runner
npm test               # all specs, headless
npm run test:smoke     # only @smoke-tagged tests
npm run test:headed    # headless run with a visible browser
```

The suite targets `https://www.saucedemo.com` by default. Override it without editing code:

```bash
CYPRESS_BASE_URL=https://staging.example.com npm test
```

---

## Dependencies

| Package | Why |
|---|---|
| `cypress` | Test runner |
| `typescript` | Type safety |
| `@types/node` | Node types for the Cypress config |
| `@cypress/grep` | Tag-based test selection and spec pre-filtering |
| `cypress-mochawesome-reporter` | HTML/JSON reports with screenshots |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-cypress`, `eslint-config-prettier` | Linting |
| `prettier` | Formatting |
| `globals` | Node globals for the flat ESLint config |

Install the same set on a fresh machine with:

```bash
npm ci
```

Do not install the old `mochawesome`, `mochawesome-merge` or `mochawesome-report-generator` packages directly; the reporter brings the compatible versions with it.

---

## First-run checklist

- [ ] `node --version` returns 22
- [ ] `npm ci` completes
- [ ] `npx cypress verify` passes
- [ ] `npm run verify` passes
- [ ] `npm run test:smoke` passes
- [ ] `npm run test:open` launches the runner
- [ ] `reports/index.html` exists after a headless run

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `cypress: command not found` | Run `npx cypress install` |
| Cypress binary download fails | Check proxy settings, then rerun `npx cypress install` |
| ESLint cannot find the config | Use ESLint 10+ and keep `eslint.config.mjs` at the repo root |
| Type errors on JSON imports | Keep `resolveJsonModule: true` in `tsconfig.json` |
| Tests cannot open `/inventory.html` directly | SauceDemo 404s deep links; always navigate through the UI |
| Chrome not found | Install Chrome or run with the default Electron browser |
| Permission errors on install | Use `nvm`; do not run `sudo npm install` |
