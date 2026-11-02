# 08 - CI/CD Integration

The repository ships with a GitHub Actions workflow at `.github/workflows/e2e.yml`.

---

## Pipeline

```yaml
name: E2E

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

concurrency:
  group: e2e-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type-check, lint and format check
        run: npm run verify

      - name: Run Cypress
        uses: cypress-io/github-action@v7
        with:
          install: false
          browser: chrome

      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: cypress-artifacts
          path: |
            reports/
            cypress/screenshots/
            cypress/videos/
          if-no-files-found: ignore
```

What each part does:

- **Node version** comes from `.nvmrc` (22), so local and CI match.
- **`npm ci`** installs exact versions and the Cypress binary.
- **`npm run verify`** fails the build on type, lint or formatting errors before tests run.
- **`install: false`** tells the Cypress action to reuse the binary from `npm ci`.
- **Artifacts** are uploaded even when tests fail, so screenshots and reports are available.

---

## Local equivalent

```bash
npm ci
npm run verify
npm test
```

Do not run `npm run test:smoke` in place of the full suite in CI. Use it as a fast pre-check or a separate targeted job.

---

## Artifacts

| Artifact | Path | When |
|---|---|---|
| HTML report | `reports/index.html` | Every run |
| JSON results | `reports/.jsons/` | Every run |
| Videos | `cypress/videos/` | Every spec (video is on) |
| Failure screenshots | `cypress/screenshots/` | Failed tests only |

`cypress-artifacts` is the artifact name in GitHub Actions. Retention follows the repository setting (default 90 days).

---

## Environment-specific runs

Set the target URL through a repository variable or secret:

```yaml
- name: Run Cypress
  uses: cypress-io/github-action@v7
  env:
    CYPRESS_BASE_URL: ${{ vars.CYPRESS_BASE_URL }}
  with:
    install: false
    browser: chrome
```

Keep `CYPRESS_BASE_URL` out of source control. The workflow falls back to the SauceDemo URL when the variable is empty.

---

## Other providers

The same commands work anywhere Node 22 and Chrome are available.

### GitLab CI

```yaml
stages: [test]

e2e:
  stage: test
  image: cypress/browsers:latest
  script:
    - npm ci
    - npm run verify
    - npm test
  artifacts:
    when: always
    paths:
      - reports/
      - cypress/screenshots/
      - cypress/videos/
    expire_in: 1 week
```

### Jenkins

```groovy
pipeline {
  agent any
  stages {
    stage('Install') { steps { sh 'npm ci' } }
    stage('Verify') { steps { sh 'npm run verify' } }
    stage('E2E') { steps { sh 'npm test' } }
  }
  post {
    always {
      archiveArtifacts artifacts: 'reports/**, cypress/screenshots/**, cypress/videos/**',
                       allowEmptyArchive: true
    }
  }
}
```

Do not commit generated reports or videos; upload them as CI artifacts.

---

## Cypress Cloud (optional)

Recording is not required. To enable parallel runs and Cloud analytics, add a project ID and run:

```bash
npx cypress run --record --key <record-key> --parallel --ci-build-id "$CI_BUILD_ID"
```

Store `record-key` as a CI secret. Keep `--parallel` off until the suite is large enough to benefit; parallel runs add orchestration cost.

---

## CI checklist

- [ ] `npm ci` uses the lockfile
- [ ] `npm run verify` gates the test run
- [ ] `CYPRESS_BASE_URL` is configured per environment
- [ ] Artifacts upload on failure
- [ ] The workflow is cancelled when a newer commit lands
- [ ] The Node version comes from `.nvmrc`
