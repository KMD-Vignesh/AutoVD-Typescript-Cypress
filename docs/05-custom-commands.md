# 05 - Custom Cypress Commands

This document explains how to create, document, and use custom Cypress commands in the AutoVD framework.

---

## Overview

Custom commands extend Cypress's `cy` object with reusable actions. They reduce duplication and make tests more readable.

All custom commands live in `cypress/support/commands.ts`.

---

## Creating Custom Commands

Edit `cypress/support/commands.ts` to add your commands:

```typescript
// cypress/support/commands.ts
import './login-command';
import './api-command';

// Or define them directly in this file
Cypress.Commands.add('login', (credentials: { email: string; password: string }) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(credentials.email);
  cy.get('[data-testid="password-input"]').type(credentials.password);
  cy.get('[data-testid="login-btn"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('register', (user: { email: string; password: string; name: string }) => {
  cy.visit('/register');
  cy.get('[data-testid="name-input"]').type(user.name);
  cy.get('[data-testid="email-input"]').type(user.email);
  cy.get('[data-testid="password-input"]').type(user.password);
  cy.get('[data-testid="register-btn"]').click();
});

Cypress.Commands.add('assertVisibleAndEnabled', { prevSubject: true }, (subject) => {
  cy.wrap(subject).should('be.visible').and('not.be.disabled');
});
```

---

## TypeScript Type Declarations

Add type declarations in `cypress/support/types.d.ts` so TypeScript knows about custom commands:

```typescript
// cypress/support/types.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom login command
     * @param credentials - User credentials { email, password }
     * @example cy.login({ email: 'user@test.com', password: 'secret123' })
     */
    login(credentials: { email: string; password: string }): Chainable<void>;

    /**
     * Custom registration command
     * @param user - User registration data
     * @example cy.register({ name: 'John', email: 'john@test.com', password: 'secret123' })
     */
    register(user: { name: string; email: string; password: string }): Chainable<void>;

    /**
     * Assert element is visible and enabled
     * @example cy.get('[data-testid="btn"]').assertVisibleAndEnabled()
     */
    assertVisibleAndEnabled(): Chainable<void>;
  }
}
```

---

## Organizing Commands into Separate Files

For large projects, split commands into domain-specific files:

```
cypress/support/
├── commands.ts           # Main entry point - imports all command modules
├── login-command.ts      # Authentication-related commands
├── api-command.ts        # API-related commands
├── form-command.ts       # Form interaction commands
└── assertion-command.ts  # Custom assertion commands
```

### Example: `cypress/support/commands.ts`

```typescript
// Import all command modules
import './login-command';
import './api-command';
import './form-command';
import './assertion-command';
```

### Example: `cypress/support/login-command.ts`

```typescript
Cypress.Commands.add('login', (credentials: { email: string; password: string }) => {
  cy.session(credentials.email, () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(credentials.email);
    cy.get('[data-testid="password-input"]').type(credentials.password);
    cy.get('[data-testid="login-btn"]').click();
  });
});
```

---

## Using `cy.session()` for Login Caching

Cypress 12+ provides `cy.session()` to cache login state across tests:

```typescript
Cypress.Commands.add('login', (credentials: { email: string; password: string }) => {
  cy.session(credentials.email, () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(credentials.email);
    cy.get('[data-testid="password-input"]').type(credentials.password);
    cy.get('[data-testid="login-btn"]').click();
    cy.url().should('include', '/dashboard');
  }, {
    validate: () => {
      // Check if session is still valid
      cy.getCookie('session_token').should('exist');
    }
  });
});
```

Then in tests:

```typescript
beforeEach(() => {
  cy.login({ email: 'user@test.com', password: 'secret123' });
});
```

---

## Custom Command Do's and Don'ts

| Do | Don't |
|----|-------|
| Add JSDoc with `@param` and `@example` | Write commands without documentation |
| Add TypeScript declarations in `types.d.ts` | Use commands without type safety |
| Use `cy.session()` for login caching | Log in before every single test |
| Return `Chainable<void>` or `Chainable<Selector>` | Return raw values from commands |
| Keep commands focused on one action | Create giant commands that do everything |
| Chain commands when appropriate | Break chains unnecessarily |