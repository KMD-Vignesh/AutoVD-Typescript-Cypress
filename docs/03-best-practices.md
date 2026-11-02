# 03 - Cypress + TypeScript Best Practices

This document outlines industry best practices for writing clean, maintainable, and scalable Cypress tests with TypeScript.

---

## 1. TypeScript Best Practices

### Enable Strict Mode

Always use TypeScript strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Use Interfaces Over Types for Objects

```typescript
// ✅ Good
interface User {
  id: number;
  email: string;
  password: string;
  role?: string;
}

// ❌ Avoid for object shapes
type User = {
  id: number;
  email: string;
};
```

### Avoid `any`

```typescript
// ❌ Bad
const user: any = { id: 1, name: 'John' };

// ✅ Good
interface User {

---

## 2. Cypress Test Best Practices

### Use `data-*` Attributes for Selectors

Avoid using CSS classes or IDs that may change. Use dedicated test attributes:

```html
<!-- Application HTML -->
<button data-testid="submit-btn" class="btn btn-primary">Submit</button>
```

```typescript
// ✅ Good - stable selector
cy.get('[data-testid="submit-btn"]').click();

// ❌ Bad - brittle, breaks on CSS changes
cy.get('.btn.btn-primary').click();
cy.get('#submit-btn').click();
```

### Never Use Hardcoded Sleeps

```typescript
// ❌ Bad - flaky and slow
cy.wait(5000);

// ✅ Good - wait for specific conditions
cy.get('[data-testid="submit-btn"]').should('be.visible');
cy.intercept('GET', '/api/users').as('getUsers');
cy.wait('@getUsers');
```

### Use `cy.intercept()` for API Stubbing

```typescript
// ✅ Good - stub API responses
cy.intercept('GET', '/api/users', { fixture: 'users' }).as('getUsers');
cy.visit('/dashboard');
cy.wait('@getUsers');

// ✅ Good - assert on API calls
cy.intercept('POST', '/api/login').as('postLogin');
cy.get('[data-testid="login-btn"]').click();
cy.wait('@postLogin').then((interception) => {
  expect(interception.response?.statusCode).to.eq(200);
});
```

### Use Custom Commands for Repetitive Actions

```typescript
// Instead of repeating this in every test:
cy.visit('/login');
cy.get('[data-testid="email"]').type(user.email);
cy.get('[data-testid="password"]').type(user.password);
cy.get('[data-testid="login-btn"]').click();

// Create a custom command (see cypress/support/commands.ts):

---

## 3. Page Object Model Best Practices

### Encapsulate Selectors in Page Objects

```typescript
// ✅ Good - LoginPage.po.ts
export class LoginPage {
  private selectors = {
    email: '[data-testid="email-input"]',
    password: '[data-testid="password-input"]',
    submit: '[data-testid="login-btn"]',
    errorMessage: '[data-testid="error-msg"]',
  };

  visit() {
    cy.visit('/login');
  }

  enterEmail(email: string) {
    cy.get(this.selectors.email).type(email);
    return this;
  }

  enterPassword(password: string) {
    cy.get(this.selectors.password).type(password);
    return this;
  }

  submit() {
    cy.get(this.selectors.submit).click();

---

## 4. Test Data & Fixtures Best Practices

### Use Fixtures for Static Data

```typescript
// ✅ Good - load from fixture
cy.fixture('users').then((users) => {
  cy.login(users.validUser);
});

// ✅ Good - import JSON directly (with resolveJsonModule)
import * as users from '../../fixtures/auth/users.json';
```

### Generate Dynamic Data with Utilities

```typescript
// ✅ Good - generate unique data per test run
const email = generateRandomEmail(); // user_123456@example.com
const password = generateRandomPassword(12);
```

---

## 5. Custom Commands Best Practices

### Add TypeScript Type Declarations

```typescript
// cypress/support/types.d.ts
declare namespace Cypress {
  interface Chainable {
    /**

---

## 6. Assertion Best Practices

### Use Explicit Assertions

```typescript
// ✅ Good - explicit and readable
cy.get('[data-testid="user-name"]').should('contain.text', 'John Doe');
cy.get('[data-testid="email"]').should('have.value', 'john@example.com');
cy.get('[data-testid="submit-btn"]').should('be.disabled');
cy.get('[data-testid="alert"]').should('have.class', 'alert-success');

// ✅ Good - use `should` with callback for complex assertions
cy.get('[data-testid="user-list"]').should(($list) => {
  expect($list).to.have.length(3);
  expect($list.eq(0)).to.contain('Alice');
});
```

### Avoid Chaining Too Many Commands

```typescript
// ❌ Hard to debug
cy.get('[data-testid="form"]').find('[data-testid="email"]').type('test@test.com').find('[data-testid="submit"]').click();

// ✅ Break into readable steps
cy.get('[data-testid="email"]').type('test@test.com');
cy.get('[data-testid="submit"]').click();
```

---

## 7. CI/CD Best Practices

### Use `npm ci` for Clean Installs

```bash
# In CI/CD pipelines
npm ci
npm run cypress:run
```

### Run Tests in Parallel (Cypress Cloud/Dashboard)

```bash
# Requires Cypress Cloud project ID
npm run cypress:run -- --record --parallel --ci-build-id $CI_BUILD_ID
```

### Always Use Headless Mode in CI

```bash
npm run cypress:run -- --browser chrome --headless
```

---

## 8. Code Quality Checklist

Before submitting a PR, verify:

- [ ] No `cy.wait()` with hardcoded milliseconds (except for debugging)
- [ ] All selectors use `data-testid` or stable attributes
- [ ] No `any` types (use `unknown` if necessary)
- [ ] Tests are independent (no shared state between `it` blocks)
- [ ] Page objects encapsulate all UI selectors
- [ ] Custom commands have JSDoc and type declarations
- [ ] Fixtures are used for static test data
- [ ] TypeScript strict mode passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatting is consistent (`npm run format`)
     * Custom login command
     * @param credentials - User credentials { email, password }
     */
    login(credentials: { email: string; password: string }): Chainable<void>;

    /**
     * Custom registration command
     */
    register(user: User): Chainable<void>;

    /**
     * Assert element is visible and enabled
     */
    assertVisibleAndEnabled(): Chainable<void>;
  }
}
```

### Document Commands with JSDoc

All custom commands should have JSDoc comments describing parameters and return types.
    return this;
  }

  login(email: string, password: string) {
    this.enterEmail(email).enterPassword(password).submit();
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }
}
```

### Use Methods That Return `this` for Chaining

```typescript
// ✅ Chainable page object methods
loginPage.enterEmail('user@test.com').enterPassword('pass123').submit();
```
cy.login(user);
```

### Keep Tests Independent

Each test should be able to run in isolation. Don't rely on state from previous tests:

```typescript
// ✅ Good - each test sets up its own state
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login({ email: 'user@test.com', password: 'secret123' });
  });

  it('should display welcome message', () => {
    cy.visit('/dashboard');
    cy.get('[data-testid="welcome-msg"]').should('contain', 'Welcome');
  });

  it('should show user profile', () => {
    cy.visit('/dashboard/profile');
    cy.get('[data-testid="user-profile"]').should('be.visible');
  });
});
```

### Use `data-testid` Over Text-Based Selectors

```typescript
// ❌ Bad - breaks when text changes
cy.contains('Login').click();

// ✅ Good - stable and intentional
cy.get('[data-testid="login-btn"]').click();
```
  id: number;
  name: string;
}
const user: User = { id: 1, name: 'John' };

// ✅ If you must, use unknown and narrow
const data: unknown = response.body;
if (typeof data === 'object' && data !== null) {
  // safe access
}
```

### Use Type Aliases for Union Types

```typescript
type Role = 'admin' | 'user' | 'guest';
type Status = 'pending' | 'active' | 'inactive';

interface User {
  role: Role;
  status: Status;
}
```