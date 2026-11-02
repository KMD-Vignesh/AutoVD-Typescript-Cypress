# 07 - Fixtures & Test Data

This document covers test data management using Cypress fixtures and TypeScript.

---

## What Are Fixtures?

Fixtures are static data files (typically JSON) used as test data in Cypress tests. They live in `cypress/fixtures/`.

---

## Folder Structure for Fixtures

```
cypress/fixtures/
├── auth/
│   └── users.json
├── dashboard/
│   └── widgets.json
├── common/
│   └── navigation.json
└── api/
    └── responses.json
```

---

## Example Fixture Files

### `cypress/fixtures/auth/users.json`

```json
{
  "validUser": {
    "email": "user@example.com",
    "password": "securePassword123"
  },
  "invalidUser": {
    "email": "wrong@example.com",
    "password": "wrongPassword"
  },
  "newUser": {
    "name": "Test User",

---

## Using Fixtures in Tests

### Method 1: `cy.fixture()` (Asynchronous)

```typescript
// cypress/e2e/auth/login.cy.ts
describe('Login', () => {
  it('should log in with valid user', () => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser);
    });
  });
});
```

### Method 2: Import JSON directly (TypeScript)

With `resolveJsonModule: true` in `tsconfig.json`:

```typescript
// cypress/e2e/auth/login.cy.ts
import * as users from '../../fixtures/auth/users.json';

describe('Login', () => {
  it('should log in with valid user', () => {
    cy.login(users.validUser);
  });
});
```

---

## Dynamic Test Data Generation

For data that shouldn't be static, use utility functions:

```typescript
// cypress/utils/data-generator.ts
export function generateRandomEmail(prefix = 'user') {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}.${timestamp}.${random}@example.com`;
}

export function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateRandomUser() {
  return {
    name: `User_${Date.now()}`,
    email: generateRandomEmail(),
    password: generateRandomPassword(),
  };
}
```

Usage:

```typescript
// cypress/e2e/users/registration.cy.ts
import { generateRandomUser } from '../../utils/data-generator';

describe('Registration', () => {
  it('should register a new user', () => {
    const newUser = generateRandomUser();
    cy.register(newUser);
    // Assertions...
  });
});
```

---

## Fixture Best Practices

| Do | Don't |
|----|-------|
| Use fixtures for static, reusable data | Put secrets/credentials in fixtures |
| Group fixtures by module/folder | Put all fixtures in one flat folder |
| Use descriptive keys (`validUser`, `adminUser`) | Use generic keys (`user1`, `user2`) |
| Generate dynamic data for unique values | Use the same static data for every test run |
| Version control fixtures in git | Commit sensitive data to fixtures |
    "email": "testuser@example.com",
    "password": "TestPass123!"
  },
  "adminUser": {
    "email": "admin@example.com",
    "password": "AdminPass123!"
  }
}
```

### `cypress/fixtures/dashboard/widgets.json`

```json
[
  {
    "id": 1,
    "name": "Analytics Widget",
    "type": "chart"
  },
  {
    "id": 2,
    "name": "Recent Activity",
    "type": "list"
  }
]
```