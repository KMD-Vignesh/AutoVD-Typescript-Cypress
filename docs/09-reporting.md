# 09 - Test Reporting

This document covers test reporting options for the AutoVD Cypress framework.

---

## Built-in Cypress Reporter

Cypress includes a default mocha reporter. For rich HTML reports, use `cypress-mochawesome-reporter`.

---


---

## Option 1: Mochawesome HTML Reporter

### Installation

```bash
npm install --save-dev cypress-mochawesome-reporter mochawesome mochawesome-merge mochawesome-report-generator
```

### Configuration

Update `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';
import initPlugin from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      return config;
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'reports',
      overwrite: false,
      html: true,
      json: true,
    },
  },
});
```

Update `cypress/support/e2e.ts`:

```typescript
import 'cypress-mochawesome-reporter/register';

// Your existing setup
beforeEach(() => {
  Cypress.mochawesomeReporter.context(Cypress.spec.name);
});
```

### Generate Report

After running tests:

```bash
npx mochawesome-merge --reportDir reports > reports/mochawesome.json
npx marge --reportDir reports --reportFilename report.html --inline
```

### npm Script

Add to `package.json`:

```json
{
  "scripts": {
    "cypress:run:report": "cypress run --reporter cypress-mochawesome-reporter",
    "report:merge": "mochawesome-merge --reportDir reports > reports/mochawesome.json && marge --reportDir reports --reportFilename report.html --inline"
  }
}
```

---

## Option 2: Allure Reporter (Alternative)

### Installation

```bash
npm install --save-dev allure-cypress allure-commandline
```

### Configuration

Update `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';
import { initPlugin } from 'allure-cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      return config;
    },
  },
});
```

### Generate Report

```bash
npx allure generate allure-results --clean
npx allure open
```

---

## Option 3: JUnit Reporter (CI Integration)

For CI systems that consume JUnit XML:

```bash
npm install --save-dev mocha-junit-reporter
```

Update `package.json`:

```json
{
  "scripts": {
    "cypress:run:junit": "cypress run --reporter mocha-junit-reporter --reporter-options mochaFile=reports/junit/results-[hash].xml"
  }
}
```

---

## Reporter Comparison

| Reporter | Format | Best For |
|----------|--------|----------|
| Mochawesome | HTML + JSON | Rich visual reports, stakeholders |
| Allure | HTML | Detailed analytics, trends, history |
| JUnit | XML | CI/CD integration (Jenkins, GitLab) |
| Cypress Default | Console | Local development, quick feedback |

---

## Screenshot & Video Artifacts

Cypress automatically captures:
- **Screenshots**: On test failure (configurable)
- **Videos**: Of entire test runs (configurable)

Configure in `cypress.config.ts`:

```typescript
export default defineConfig({
  e2e: {
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
  },
});
```

---

## Report Retention

Add to `.gitignore`:

```gitignore
reports/
cypress/screenshots/
cypress/videos/
```

Upload reports as CI/CD artifacts instead of committing them to version control.
## Mochawesome Setup

Install the reporter:

```bash
npm install --save-dev cypress-mochawesome-reporter mochawesome mochawesome-merge mochawesome-report-generator
```