# 08 - CI/CD Integration

This document covers integrating the AutoVD Cypress framework with CI/CD pipelines.

---

## Overview

The framework is designed to run in any CI/CD environment (GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps, etc.).

---

## GitHub Actions Example

Create `.github/workflows/cypress.yml`:

```yaml
name: Cypress Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Cypress Tests
        run: npm run cypress:run -- --browser chrome --headless
        env:
          CYPRESS_BASE_URL: ${{ secrets.BASE_URL }}
          CYPRESS_API_URL: ${{ secrets.API_URL }}

      - name: Upload Cypress Screenshots
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots/

      - name: Upload Cypress Videos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-videos

---

## GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test

cypress_tests:
  stage: test
  image: node:20
  before_script:
    - npm ci
  script:
    - npm run cypress:run -- --browser chrome --headless
  artifacts:
    when: always
    paths:
      - cypress/screenshots/
      - cypress/videos/
      - reports/
    expire_in: 1 week
  only:
    - main
    - merge_requests
```

---

## Jenkins Pipeline Example

Create `Jenkinsfile`:

```groovy
pipeline {
    agent any

    environment {
        CYPRESS_BASE_URL = 'https://staging.example.com'
        CYPRESS_API_URL = 'https://api.staging.example.com'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Cypress Tests') {
            steps {
                sh 'npm run cypress:run -- --browser chrome --headless'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**, cypress/videos/**, reports/**'
                }
            }
        }
    }
}
```

---

## Cypress Cloud (Dashboard) Integration

Record tests to Cypress Cloud for parallel execution and analytics:

```bash
# Set your project ID in cypress.config.ts
# Then run:
npm run cypress:run -- --record --key <your-record-key> --parallel --ci-build-id $CI_BUILD_ID
```

Add to `cypress.config.ts`:

```typescript
export default defineConfig({
  e2e: {
    projectId: 'your-project-id', // From Cypress Cloud
    // ... other config
  },
});
```

---

## CI/CD Best Practices

| Practice | Why |
|----------|-----|
| Use `npm ci` instead of `npm install` | Reproducible, clean installs |
| Run in headless mode | Faster, no GUI overhead |
| Cache `node_modules` | Faster pipeline runs |
| Upload artifacts on failure | Debug screenshots/videos |
| Use environment variables | Secure, environment-specific config |
| Run tests in parallel | Faster execution on large suites |
| Pin Node.js version | Consistent behavior across environments |
          path: cypress/videos/

      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        with:
          name: cypress-results
          path: reports/
```