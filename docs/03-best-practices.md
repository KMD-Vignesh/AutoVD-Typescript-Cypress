# 03 - Best Practices

Conventions used across this framework. Examples use SauceDemo selectors and the current `cy.login` command.

---

## 1. Selectors

### Prefer stable test attributes

```typescript
// Good: supplied for automation and unlikely to change
cy.get('[data-test="login-button"]').click();

// Fragile: breaks when copy or layout changes
cy.contains('Login').click();
```

SauceDemo exposes `data-test` attributes. Keep selectors inside page objects.

### Scope broad selectors

```typescript
// Good: one row, then its action
cy.contains('.inventory_item', productName)
  .find('[data-test^="add-to-cart-"]')
  .click();

// Risky: matches the first button on the page
cy.get('[data-test^="add-to-cart-"]').first().click();
```

---

## 2. Waits and Assertions

### Never hard-wait for a fixed time

```typescript
// Bad
cy.wait(3000);

// Good: Cypress retries the assertion until it passes or times out
cy.get('.inventory_list').should('be.visible');
```

`cy.wait()` is acceptable only for a network alias when the response timing matters.

### Assert on retryable state

```typescript
// Good: retries until the badge disappears
cy.get('.shopping_cart_badge').should('not.exist');

// Bad: runs once, before the UI has settled
cy.get('body').then(($body) => {
  expect($body.find('.shopping_cart_badge')).to.have.length(0);
});
```

---

## 3. Test Independence

Each test starts from a known state. Cypress test isolation clears cookies and storage between tests.

```typescript
describe('Products', () => {
  beforeEach(() => {
    cy.login(users.validUser);
  });

  it('adds one product', () => {
    productsPage.addProductToCartByName('Sauce Labs Backpack');
    productsPage.assertCartBadgeCount(1);
  });
});
```

Do not depend on a product added by a previous test. Do not share mutable objects between tests.

---

## 4. Page Objects and Commands

| Use a page object when | Use a command when |
|---|---|
| The logic belongs to one page | The flow spans pages |
| It maps selectors to actions | It is shared setup (login, seed data) |
| It returns page-level assertions | It wraps a reusable workflow |

```typescript
// Page object action
productsPage.addProductToCartByName('Sauce Labs Backpack');

// Shared command
beforeEach(() => {
  cy.login(users.validUser);
});
```

Rules:

- Selectors stay `private` in the page object.
- Actions return `this`; getters return Cypress chains.
- Commands reuse page objects; they do not duplicate selectors.
- Every custom command has a type declaration in `support/types.d.ts`.

See `docs/04-page-object-model.md` and `docs/05-custom-commands.md`.

---

## 5. Test Data

### Use fixtures for static data

```typescript
import * as users from '../../fixtures/saucedemo/users.json';

beforeEach(() => {
  cy.login(users.validUser);
});
```

### Generate data only when uniqueness is required

```typescript
const uniqueEmail = `user.${Date.now()}@example.com`;
```

Do not add a shared generator for one caller. Extract it when a second spec needs it.

Never put real credentials in fixtures. Use environment variables for secrets.

---

## 6. TypeScript

Strict mode is enabled. Keep it useful:

```typescript
// Good: explicit model
interface CheckoutUserInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

// Good: unknown at the boundary, then narrow
const body: unknown = response.body;
if (typeof body === 'object' && body !== null) {
  // safe access
}

// Avoid: any turns off the compiler
const data: any = response.body;
```

Use union types for bounded values:

```typescript
sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
  cy.get(this.selectors.sortDropdown).select(value);
}
```

`tsconfig.json` enables `noUnusedLocals` and `noUnusedParameters`. Delete dead helpers instead of disabling the rules.

---

## 7. Network

Intercept before the action that triggers the request:

```typescript
cy.intercept('GET', '/api/users').as('getUsers');
cy.get('[data-test="load-users"]').click();
cy.wait('@getUsers');
```

Stub only when the test is about frontend behavior, not when it is an end-to-end flow:

```typescript
cy.intercept('GET', '/api/users', { fixture: 'saucedemo/users' });
```

For the SauceDemo suite, prefer real UI flows. A mocked checkout proves less than a real one.

---

## 8. Error Handling

Do not suppress uncaught application errors globally:

```typescript
// Bad: hides real regressions
Cypress.on('uncaught:exception', () => false);
```

If a known third-party error must be ignored, match its message and document why:

```typescript
Cypress.on('uncaught:exception', (error) => {
  if (error.message.includes('ResizeObserver loop')) {
    return false;
  }
});
```

Cypress already captures a screenshot on failure. Do not add a second screenshot in `afterEach`.

---

## 9. CI

```bash
npm ci
npm run verify
npm test
```

- `npm ci` for reproducible installs.
- `npm run verify` before tests so type/lint/format failures fail fast.
- Headless Chrome in CI.
- Upload `reports/`, screenshots and videos as artifacts.
- Pin Node through `.nvmrc`.

Details: `docs/08-ci-cd-integration.md`.

---

## 10. Review checklist

- [ ] No selectors in specs
- [ ] No `cy.wait(number)`
- [ ] Assertions retry (`.should(...)`)
- [ ] Each test sets up its own state
- [ ] Page object actions return `this`
- [ ] Custom commands are typed and documented
- [ ] Fixtures contain only data that is used
- [ ] No `any` without a comment
- [ ] `npm run verify` passes
- [ ] Critical paths are tagged `@smoke`

---

## 11. Anti-patterns

| Anti-pattern | Why it hurts |
|---|---|
| `cy.wait(5000)` | Slows every run and still flakes |
| `cy.get('body').then(...)` for visibility | Does not retry |
| One `AllPages.ts` class | Everything changes together |
| Global `uncaught:exception` suppression | Hides real failures |
| Duplicate screenshot handlers | Noise and conflicting errors |
| Unused helpers and fixtures | Misleading surface area |
| Testing through the UI for setup | Slow and brittle; use commands/API when available |
