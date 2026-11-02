# 05 - Custom Commands & Shared Login

Custom commands are for behavior shared by many specs. Page objects are for page-level actions. Keep the boundary clear.

---

## How commands are registered

`cypress/support/e2e.ts` imports the command file once per spec:

```typescript
import './commands';
import 'cypress-mochawesome-reporter/register';
import { register as registerCypressGrep } from '@cypress/grep';

registerCypressGrep();
```

`cypress/support/commands.ts`:

```typescript
import { LoginPage } from '../page-objects/saucedemo/LoginPage';

Cypress.Commands.add('login', (user: { username: string; password: string }) => {
  new LoginPage().visit().login(user);
  cy.url().should('include', '/inventory.html');
});
```

Types live in `cypress/support/types.d.ts`:

```typescript
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(user: { username: string; password: string }): Chainable<void>;
  }
}
```

Because `tsconfig.json` includes `cypress/**/*.ts`, the declaration is global and specs get autocomplete and type checking.

Usage:

```typescript
import * as users from '../../fixtures/saucedemo/users.json';

beforeEach(() => {
  cy.login(users.validUser);
});
```

---

## Why the login is not using `cy.session()`

`cy.session()` is the standard way to cache authentication. It works when a restored session can open a protected URL directly.

SauceDemo does not support that:

- `https://www.saucedemo.com/inventory.html` returns **404** on a full page load.
- Loading `/` with a restored cookie does **not** redirect to the inventory page.

A cached session therefore cannot get the test back into the app. The command logs in through the UI instead. The same restriction is documented in `commands.ts` as a `shortcut:` comment.

If this framework is pointed at a real application that supports deep links, replace the body with:

```typescript
Cypress.Commands.add('login', (user) => {
  cy.session(user.username, () => {
    new LoginPage().visit().login(user);
    cy.url().should('include', '/inventory.html');
  });

  cy.visit('/inventory.html'); // only if the app allows deep links
});
```

---

## When to add a command

Add a command when the same multi-step action appears in two or more specs:

| Need | Where |
|---|---|
| A page action (click, type, assert) | Page object |
| Login, logout, seed data, feature flags | Custom command |
| One-off setup used by one spec | Keep it in that spec |
| Pure helper (formatting, generating data) | Plain function in the spec or a module-level helper |

Do not create a command that only wraps one `cy.get()`; the page object is the right place.

---

## Command checklist

- [ ] Registered in `cypress/support/commands.ts`
- [ ] Imported by `cypress/support/e2e.ts`
- [ ] Declared in `cypress/support/types.d.ts`
- [ ] Has a short doc comment with one usage example
- [ ] Reuses page objects instead of duplicating selectors
- [ ] Does not contain scenario assertions that belong in a spec

---

## Tagging tests

Test selection uses `@cypress/grep`, not a custom command. Add tags directly to the test:

```typescript
it('should complete a full checkout flow with one product', { tags: '@smoke' }, () => {
  // ...
});
```

Run them with:

```bash
npm run test:smoke
```

Tags are also recognized on `describe` blocks and accept arrays for multiple tags. See `docs/06-configuration.md` for the `expose` settings.
