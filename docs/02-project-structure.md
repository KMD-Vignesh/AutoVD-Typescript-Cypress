# 02 - Project Structure & Module Organization

This document defines the recommended folder architecture for a scalable, maintainable Cypress TypeScript framework. The structure follows separation of concerns, grouping code by module/feature rather than by file type.

---

## Recommended Directory Layout

```
AutoVD-Typescript-Cypress/
├── cypress/
│   ├── e2e/                          # End-to-end test specifications
│   │   ├── auth/                     # Module: Authentication
│   │   │   ├── login.cy.ts           # Login tests
│   │   │   ├── logout.cy.ts          # Logout tests
│   │   │   └── registration.cy.ts    # Registration tests
│   │   ├── dashboard/                # Module: Dashboard
│   │   │   ├── dashboard.cy.ts
│   │   │   └── widgets.cy.ts
│   │   ├── users/                    # Module: User Management
│   │   │   ├── user-profile.cy.ts
│   │   │   └── user-settings.cy.ts
│   │   ├── common/                   # Module: Common / Shared flows
│   │   │   ├── navigation.cy.ts
│   │   │   └── breadcrumbs.cy.ts
│   │   └── smoke/                    # Smoke test suite
│   │       └── smoke.cy.ts
│   ├── fixtures/                     # Static test data (JSON)
│   │   ├── auth/
│   │   │   └── users.json
│   │   ├── dashboard/
│   │   │   └── widgets.json
│   │   └── common/
│   │       └── navigation.json
│   ├── page-objects/                 # Page Object Model classes
│   │   ├── auth/
│   │   │   ├── LoginPage.po.ts
│   │   │   └── RegisterPage.po.ts
│   │   ├── dashboard/
│   │   │   └── DashboardPage.po.ts
│   │   ├── common/
│   │   │   ├── Navbar.po.ts
│   │   │   └── Footer.po.ts
│   │   └── base/
│   │       └── BasePage.po.ts        # Base class with shared methods
│   ├── support/
│   │   ├── e2e.ts                    # Global before/after hooks
│   │   ├── commands.ts               # Custom Cypress commands
│   │   └── types.d.ts                # TypeScript declarations
│   ├── utils/                        # Reusable utility functions
│   │   ├── api/
│   │   │   └── request.ts            # API request helpers
│   │   ├── constants.ts              # App-wide constants
│   │   ├── data-generator.ts         # Random test data generators
│   │   └── helpers.ts                # General helper functions
│   └── downloads/                    # Downloaded files during tests
├── docs/                             # Documentation (this folder)
├── reports/                          # Test execution reports (gitignored)
├── cypress.config.ts                 # Cypress configuration (TS)
├── package.json                      # NPM manifest
├── tsconfig.json                     # TypeScript configuration
├── .eslintrc.js                      # ESLint configuration
├── .prettierrc                       # Prettier configuration
└── .gitignore                        # Git ignore rules
```

---

## Module-Based Organization

Each module (e.g., auth, dashboard, users) is a self-contained feature area containing:

1. **Test specs** (`cypress/e2e/<module>/`) — Test cases for that module
2. **Page objects** (`cypress/page-objects/<module>/`) — UI mappings and actions
3. **Fixtures** (`cypress/fixtures/<module>/`) — Test data specific to that module

### Example: auth Module

```
cypress/
├── e2e/auth/
│   ├── login.cy.ts
│   ├── logout.cy.ts
│   └── registration.cy.ts
├── page-objects/auth/
│   ├── LoginPage.po.ts
│   ├── RegisterPage.po.ts
│   └── LogoutPage.po.ts
└── fixtures/auth/
    └── users.json
```

---

## File Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Test spec | `<feature>.cy.ts` | `login.cy.ts` |
| Page object | `<PageName>.po.ts` | `LoginPage.po.ts` |
| Base page | `BasePage.po.ts` | `BasePage.po.ts` |
| Custom command file | `commands.ts` | `commands.ts` |
| Fixture data | `<data-set>.json` | `users.json` |
| Utility | `<purpose>.ts` | `data-generator.ts` |
| Constant | `constants.ts` | `constants.ts` |

---

## Separation of Concerns

### 1. Test Specs (`cypress/e2e/`)
- **Responsibility**: Define test scenarios, assertions, and test flow
- **Should NOT contain**: CSS selectors, DOM queries, page-specific logic
- **Should use**: Page objects, custom commands, fixtures

### 2. Page Objects (`cypress/page-objects/`)
- **Responsibility**: Encapsulate UI selectors and page interactions
- **Should NOT contain**: Test assertions, business logic unrelated to UI
- **Should contain**: Selectors, click/type/navigate methods, verification helpers

### 3. Custom Commands (`cypress/support/commands.ts`)
- **Responsibility**: Reusable Cypress commands across tests
- **Examples**: `login()`, `createUser()`, `assertElementVisible()`

### 4. Fixtures (`cypress/fixtures/`)
- **Responsibility**: Static test data (JSON)
- **Examples**: User credentials, product details, API mock responses

### 5. Utilities (`cypress/utils/`)
- **Responsibility**: Non-UI helper functions
- **Examples**: API request wrappers, random data generators, date formatters

---

## Import Path Strategy

Use relative imports within the same module, and relative imports across modules:

```typescript
// Same module (e.g., auth test importing auth page object)
import { LoginPage } from '../../page-objects/auth/LoginPage';

// Cross-module (e.g., dashboard test importing navbar page object)
import { Navbar } from '../../page-objects/common/Navbar';

// Utils
import { generateRandomUser } from '../../utils/data-generator';

// Fixtures
import * as users from '../../fixtures/auth/users.json';
```

> Avoid deep relative paths like `../../../` by keeping modules shallow. If paths become too deep, consider adding path aliases in `tsconfig.json`.

---

## Scalability Guidelines

1. **One module per folder** — Don't mix unrelated features in the same folder
2. **One page object per page/component** — Don't create a giant `AllPages.po.ts`
3. **One test spec per feature** — `login.cy.ts` for login, not `everything.cy.ts`
4. **Shared components in `common/`** — Header, footer, navigation, modals
5. **Base page for shared UI methods** — `BasePage.po.ts` for `visit()`, `waitForLoad()`, etc.
6. **Keep test specs lean** — Move complex logic to page objects or utils

---

## .gitignore Recommendations

```gitignore
# Dependencies
node_modules/

# Cypress
cypress/downloads/
cypress/screenshots/
cypress/videos/
cypress/results/

# Reports
reports/

# TypeScript
*.tsbuildinfo

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
```