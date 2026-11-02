<div align="center">

<h1>AutoVD-Typescript-Cypress</h1>

<p><strong>End-to-end web test framework for Cypress + TypeScript</strong><br>
Cypress · TypeScript · Page Objects · Custom Commands · Mochawesome</p>

<p>
  <a href="https://github.com/KMD-Vignesh/AutoVD-Typescript-Cypress"><img src="https://img.shields.io/badge/Node-22-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node 22"></a>
  <a href="https://github.com/KMD-Vignesh/AutoVD-Typescript-Cypress"><img src="https://img.shields.io/badge/Cypress-16.2-69D3A7?style=for-the-badge&logo=cypress&logoColor=white" alt="Cypress 16.2"></a>
  <a href="https://github.com/KMD-Vignesh/AutoVD-Typescript-Cypress"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.9"></a>
  <a href="https://github.com/KMD-Vignesh/AutoVD-Typescript-Cypress/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-2EA44F?style=for-the-badge" alt="MIT License"></a>
</p>

</div>

## Intro

<div>

<img src="https://img.shields.io/badge/Vignesh&nbsp;D,&nbsp;QA&nbsp;Lead/Architect,&nbsp;Chennai,India-B2C6DB?style=for-the-badge" alt="Vignesh">

<p>
    <a href="https://www.linkedin.com/in/kmd-vignesh/"><img src="https://img.shields.io/badge/LinkedIn-0A75AD?style=for-the-badge" alt="LinkedIn"></a>
    <a href="https://github.com/KMD-Vignesh"><img src="https://img.shields.io/badge/GitHub-FF6A80?style=for-the-badge" alt="GitHub"></a>
    <a href="mailto:KMD.Vignesh@outlook.com"><img src="https://img.shields.io/badge/KMD.Vignesh@Outlook-2a9d8f?style=for-the-badge" alt="Email"></a>

</p>

</div>

## What It Is

A Cypress + TypeScript E2E suite with page objects, typed fixtures, tag filtering, and a CI pipeline that runs on every push. Specs stay short because navigation and selectors live in page objects and custom commands.

- **21 scenarios across 3 specs** — login, products, and checkout on SauceDemo.
- **Page objects with typed selectors** — one class per screen; specs describe behaviour only.
- **Tagged runs** — `@smoke` and other tags filter specs through `@cypress/grep`.
- **Reports and artifacts** — Mochawesome HTML plus video and failure screenshots, uploaded by CI.

## Framework Family

Seven implementations of the same layered idea. Pick the stack your team already uses; the concepts and reports stay familiar.

| Framework                       | Stack                         | Covers    | Repository                                                                                  |
| :------------------------------ | :---------------------------- | :-------- | :------------------------------------------------------------------------------------------ |
| **Java + Selenium**             | Java 17 · Selenium 4 · TestNG | UI + REST | [AutoVD-Java-Selenium](https://github.com/KMD-Vignesh/AutoVD-Java-Selenium)                 |
| **Java + Playwright**           | Java 17 · Playwright · TestNG | UI + REST | [AutoVD-Java-Playwright](https://github.com/KMD-Vignesh/AutoVD-Java-Playwright)             |
| **C# + Playwright**             | C# · Playwright · NUnit       | UI        | [AutoVD-CS-Playwright](https://github.com/KMD-Vignesh/AutoVD-CS-Playwright)                 |
| **Python + Selenium**           | Python · Selenium · pytest    | UI + REST | [AutoVD-Python-Selenium](https://github.com/KMD-Vignesh/AutoVD-Python-Selenium)             |
| **Python + Playwright**         | Python · Playwright · pytest  | UI        | [AutoVD-Python-Playwright](https://github.com/KMD-Vignesh/AutoVD-Python-Playwright)         |
| **TypeScript + Playwright**     | TypeScript · Playwright       | UI + REST | [AutoVD-Typescript-Playwright](https://github.com/KMD-Vignesh/AutoVD-Typescript-Playwright) |
| **TypeScript + Cypress** — this repo | TypeScript · Cypress     | UI (E2E)  | [AutoVD-Typescript-Cypress](https://github.com/KMD-Vignesh/AutoVD-Typescript-Cypress)       |

## Quick Start

**Prerequisites:** Node.js 22 (see `.nvmrc`) and npm.

```bash
git clone https://github.com/KMD-Vignesh/AutoVD-Typescript-Cypress.git
cd AutoVD-Typescript-Cypress
npm ci
npm test
```

The default run is headless against `https://www.saucedemo.com`. To watch it, use `npm run test:open`.

Open the report:

```bash
open reports/index.html
```

On Linux use `xdg-open`; on Windows open the file from Explorer.

## Configuration

`cypress.config.ts` holds the suite configuration:

| Setting | Default | What it does |
| :--- | :--- | :--- |
| `baseUrl` | `CYPRESS_BASE_URL` or SauceDemo | Target application |
| `specPattern` | `cypress/e2e/**/*.cy.ts` | Spec discovery |
| `defaultCommandTimeout` | `10000` | Per-command timeout in milliseconds |
| `pageLoadTimeout` | `60000` | Page-load timeout |
| `retries.runMode` | `1` | One retry for failed tests in CI |
| `video` | `true` | Record every spec |
| `screenshotOnRunFailure` | `true` | Capture failure screenshots |
| `reporter` | `cypress-mochawesome-reporter` | HTML report in `reports/` |

Point the suite at another environment with an environment variable:

```bash
CYPRESS_BASE_URL=https://staging.example.com npm test
```

Tag filtering uses `@cypress/grep` through the `expose` block; `npm run test:smoke` runs only `@smoke` tests.

## Writing Tests

A spec uses a page object and a typed fixture:

```typescript
import { LoginPage } from '../../page-objects/saucedemo/LoginPage';
import * as users from '../../fixtures/saucedemo/users.json';

describe('SauceDemo - Login', () => {
  it('logs in with standard_user', () => {
    new LoginPage().visit().login(users.validUser);
    cy.url().should('include', '/inventory.html');
  });

  it('shows an error for invalid credentials', () => {
    new LoginPage().visit().login(users.invalidUser);
    cy.get('[data-test="error"]').should('be.visible');
  });
});
```

A page object extends `BasePage` and returns `this`, so calls chain:

```typescript
export class LoginPage extends BasePage {
  private readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
  };

  visit() {
    cy.visit('/');
    return this;
  }

  login(credentials: { username: string; password: string }) {
    cy.get(this.selectors.usernameInput).type(credentials.username);
    cy.get(this.selectors.passwordInput).type(credentials.password);
    cy.get(this.selectors.loginButton).click();
    return this;
  }
}
```

## Framework Map

Read these in order. Everything else supports them.

| Path | What it does |
| :--- | :--- |
| `cypress/e2e/saucedemo/` | Specs: `login`, `products`, `checkout`. **Start here.** |
| `cypress/page-objects/base/BasePage.ts` | Shared navigation |
| `cypress/page-objects/saucedemo/` | One class per screen |
| `cypress/support/commands.ts` | Typed custom commands (`cy.login`) |
| `cypress/fixtures/saucedemo/` | Users and checkout data |
| `cypress.config.ts` | Target URL, timeouts, retries, reporter |
| `docs/` | Nine focused guides, from setup to CI |

## How a Run Works

1. Cypress loads `cypress.config.ts` and the support file.
2. `@cypress/grep` filters specs when a tag is supplied.
3. Each spec builds a page object; selectors stay in the page, assertions in the spec.
4. Mochawesome writes HTML and JSON to `reports/`; video and screenshots land under `cypress/`.
5. CI (`.github/workflows/e2e.yml`) runs `npm ci`, `npm run verify`, then Cypress, and uploads all artifacts.

## Project Layout

```text
AutoVD-Typescript-Cypress/
├── cypress/
│   ├── e2e/saucedemo/        # specs
│   ├── page-objects/         # BasePage + screen classes
│   ├── support/              # custom commands and types
│   ├── fixtures/saucedemo/   # test data
│   ├── screenshots/          # generated on failure
│   └── videos/               # generated recordings
├── docs/                     # nine guides
├── reports/                  # generated: Mochawesome HTML + JSON
├── cypress.config.ts
└── package.json
```

`screenshots/`, `videos/`, and `reports/` are generated artifacts.

## Reports

| Output | Location |
| :--- | :--- |
| HTML report | `reports/index.html` |
| JSON results | `reports/.jsons/` |
| Videos | `cypress/videos/` |
| Failure screenshots | `cypress/screenshots/` |

CI uploads all four as the `cypress-artifacts` artifact.

## Documentation

| Guide | Description |
| :--- | :--- |
| [Installation](docs/01-installation.md) | Setup and verification |
| [Project structure](docs/02-project-structure.md) | Folder rules |
| [Best practices](docs/03-best-practices.md) | Cypress and TypeScript conventions |
| [Page object model](docs/04-page-object-model.md) | Page-object rules |
| [Custom commands](docs/05-custom-commands.md) | Shared command patterns |
| [Configuration](docs/06-configuration.md) | Cypress, TypeScript, ESLint, env |
| [Fixtures and test data](docs/07-fixtures-test-data.md) | Data management |
| [CI/CD](docs/08-ci-cd-integration.md) | Pipeline and artifacts |
| [Reporting](docs/09-reporting.md) | Reports, screenshots, videos |

## Troubleshooting

| Symptom | Fix |
| :--- | :--- |
| Tests hit the wrong URL | Set `CYPRESS_BASE_URL`; the default is SauceDemo. |
| Tag filter runs nothing | Tags must exist on the spec or test; check the `@smoke` spelling. |
| `npm test` fails on Node | Use Node 22 (`nvm use`) — see `.nvmrc`. |
| Type or lint errors | Run `npm run verify`; it runs type-check, ESLint, and Prettier. |
| Videos make CI artifacts huge | Set `video: false` locally or when storage is tight. |
| Report is empty | Mochawesome writes at process exit; let the run finish. |

## License

MIT. See [`LICENSE`](LICENSE).
