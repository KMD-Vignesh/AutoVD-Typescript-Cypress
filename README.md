# AutoVD - Scalable Cypress TypeScript Test Framework

A production-ready, modular, and scalable Cypress automation framework built with TypeScript, following industry best practices for clean architecture, maintainability, and extensibility.

## 📁 Project Structure

```
AutoVD-Typescript-Cypress/
├── cypress/
│   ├── e2e/                 # Test specifications (organized by feature/module)
│   ├── fixtures/            # Test data (JSON files)
│   ├── page-objects/        # Page Object Model classes (one per page/component)
│   ├── support/
│   │   ├── commands.ts      # Custom Cypress commands
│   │   ├── e2e.ts           # Global setup/teardown hooks
│   │   └── types.d.ts       # TypeScript type declarations
│   └── utils/               # Helper utilities (API, constants, generators, etc.)
├── docs/                    # Comprehensive documentation
├── reports/                 # Test execution reports (generated)
├── cypress.config.ts        # Cypress configuration (TypeScript)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Open Cypress Test Runner (interactive mode)
npm run cypress:open

# 3. Run all tests in headless mode (CI)
npm run cypress:run

# 4. Run tests for a specific module
npm run cypress:run -- --spec "cypress/e2e/login/login.cy.ts"

# 5. Run tests in a specific browser
npm run cypress:run -- --browser chrome
```

## 📚 Documentation

All detailed documentation is located in the [`docs/`](./docs) folder:

| Doc | Description |
|-----|-------------|
| [01-installation](./docs/01-installation.md) | Clean CLI installation guide |
| [02-project-structure](./docs/02-project-structure.md) | Folder architecture & module organization |
| [03-best-practices](./docs/03-best-practices.md) | Cypress + TypeScript best practices |
| [04-page-object-model](./docs/04-page-object-model.md) | Page Object Model implementation guide |
| [05-custom-commands](./docs/05-custom-commands.md) | Custom Cypress commands |
| [06-configuration](./docs/06-configuration.md) | Cypress & TypeScript configuration |
| [07-fixtures-test-data](./docs/07-fixtures-test-data.md) | Test data & fixtures management |
| [08-ci-cd-integration](./docs/08-ci-cd-integration.md) | CI/CD pipeline setup |
| [09-reporting](./docs/09-reporting.md) | Test reporting & analytics |

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run cypress:open` | Open Cypress Test Runner (GUI) |
| `npm run cypress:run` | Run all tests headlessly |
| `npm run cypress:run:chrome` | Run tests in Chrome |
| `npm run cypress:run:electron` | Run tests in Electron |
| `npm run lint` | Lint TypeScript files |
| `npm run lint:fix` | Auto-fix lint issues |

## 🧪 Test Naming Convention

- Test files: `<feature-name>.cy.ts` (e.g., `login.cy.ts`, `dashboard.cy.ts`)
- Page objects: `<PageName>.po.ts` (e.g., `LoginPage.po.ts`, `DashboardPage.po.ts`)
- Custom commands: grouped by domain in `cypress/support/commands.ts`
- Fixtures: `<data-set>.json` (e.g., `users.json`, `products.json`)

## 🤝 Contributing

1. Follow the folder structure strictly
2. Create separate page objects per module/page
3. Keep test specs focused on one feature
4. Use TypeScript strict mode
5. Document all custom commands with JSDoc
6. Add fixtures for reusable test data

## License

MIT