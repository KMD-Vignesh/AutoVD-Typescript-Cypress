# 02 - Project Structure & Module Organization

The framework groups files by feature module, not by file type. A module owns its specs, page objects and fixtures under the same name.

---

## Directory layout

```
AutoVD-Typescript-Cypress/
├── .github/
│   └── workflows/
│       └── e2e.yml                  # Type-check, lint, run, upload artifacts
├── cypress/
│   ├── e2e/
│   │   └── saucedemo/               # One folder per feature module
│   │       ├── login.cy.ts
│   │       ├── products.cy.ts
│   │       └── checkout.cy.ts
│   ├── fixtures/
│   │   └── saucedemo/
│   │       ├── users.json
│   │       └── checkout-info.json
│   ├── page-objects/
│   │   ├── base/
│   │   │   └── BasePage.ts          # Shared navigation only
│   │   └── saucedemo/
│   │       ├── LoginPage.ts
│   │       ├── ProductsPage.ts
│   │       ├── CartPage.ts
│   │       └── CheckoutPage.ts
│   ├── support/
│   │   ├── commands.ts              # cy.login and future shared commands
│   │   ├── e2e.ts                   # Reporter and grep registration
│   │   └── types.d.ts               # Custom command type declarations
│   ├── downloads/                   # Gitignored
│   ├── screenshots/                 # Gitignored
│   └── videos/                      # Gitignored
├── docs/
├── reports/                         # Gitignored
├── .editorconfig
├── .nvmrc
├── .prettierignore
├── cypress.config.ts
├── eslint.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## Module rules

A module is self-contained:

1. **Specs** — `cypress/e2e/<module>/*.cy.ts`
2. **Page objects** — `cypress/page-objects/<module>/*.ts`
3. **Fixtures** — `cypress/fixtures/<module>/*.json`

If a new area is not related to any existing module, create a new module with the same three folders. Do not mix selectors for one area into another module's page object.

Example:

```
cypress/
├── e2e/checkout/
├── fixtures/checkout/
└── page-objects/checkout/
```

The current reference module is `saucedemo` because every SauceDemo area shares one demo application.

---

## Naming conventions

| File type | Pattern | Example |
|---|---|---|
| Spec | `<feature>.cy.ts` | `checkout.cy.ts` |
| Page object | `<PageName>.ts` | `CheckoutPage.ts` |
| Base page | `BasePage.ts` | `BasePage.ts` |
| Fixture | `<data-set>.json` | `users.json` |
| Shared command | `commands.ts` | `commands.ts` |
| Type declarations | `types.d.ts` | `types.d.ts` |
| Config | `<tool>.config.*` | `cypress.config.ts` |

Page object files use the class name directly. The folder already says `page-objects`, so a `.po.ts` suffix is redundant.

---

## Responsibility boundaries

### Specs

- **Own:** scenarios, assertions, test data selection, tags.
- **Do not own:** CSS selectors, repeated page interactions.
- **Use:** page objects, fixtures, `cy.login`.

### Page objects

- **Own:** selectors, page actions, page-level assertions.
- **Do not own:** test scenarios or cross-page business flows.
- **Return:** `this` from actions for chaining; return Cypress chains only from getters.

### Fixtures

- **Own:** static, reusable data.
- **Do not own:** secrets, environment URLs, generated values.

### Support

- **Own:** global setup, custom commands and their types.
- **Keep small:** no test logic, no page selectors.

---

## When to add a new file

| Need | Add |
|---|---|
| A new user flow | `cypress/e2e/<module>/<flow>.cy.ts` |
| A new screen or reusable component | `cypress/page-objects/<module>/<Name>Page.ts` |
| Static test data | `cypress/fixtures/<module>/<set>.json` |
| Repeated multi-page action | A command in `cypress/support/commands.ts` + its type |
| One-off helper used by one spec | Keep it in that spec |

Avoid creating shared utilities until two specs need them.
