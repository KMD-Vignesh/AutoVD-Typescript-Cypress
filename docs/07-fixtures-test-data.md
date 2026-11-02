# 07 - Fixtures & Test Data

Fixtures are static JSON files under `cypress/fixtures/`. They are grouped by module like specs and page objects.

---

## Current fixtures

```
cypress/fixtures/
└── saucedemo/
    ├── users.json
    └── checkout-info.json
```

`users.json`:

```json
{
  "validUser": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "lockedOutUser": {
    "username": "locked_out_user",
    "password": "secret_sauce"
  },
  "invalidUser": {
    "username": "invalid_user",
    "password": "wrong_password"
  }
}
```

`checkout-info.json`:

```json
{
  "validInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "zipCode": "12345"
  }
}
```

Keep only data that a test uses. Unused fixture keys become stale and misleading.

---

## Using fixtures

### Import JSON directly (recommended here)

`tsconfig.json` sets `resolveJsonModule: true`, so imports are type-checked:

```typescript
import * as users from '../../fixtures/saucedemo/users.json';
import * as checkoutInfo from '../../fixtures/saucedemo/checkout-info.json';

beforeEach(() => {
  cy.login(users.validUser);
});

it('completes checkout', () => {
  checkoutPage.fillCheckoutInformation(checkoutInfo.validInfo);
});
```

Advantages:

- Type inference and autocomplete.
- No asynchronous fixture loading.
- A missing key or file is caught by `tsc`.

### Cypress `cy.fixture()`

Use it when the fixture must be loaded at runtime, for example a file chosen by environment:

```typescript
cy.fixture('saucedemo/users').then((users) => {
  cy.login(users.validUser);
});
```

Do not mix both styles for the same module without a reason.

---

## When to generate data

Dynamic data is useful when a value must be unique per run, such as an email address. Keep the generator next to the test until a second test needs it:

```typescript
const uniqueEmail = `user.${Date.now()}@example.com`;
```

If three or more specs need the same generator, move it to a module-level helper and add a small test for the format. Do not add a generic `data-generator.ts` for one caller.

SauceDemo uses fixed demo accounts, so its fixtures are static by design.

---

## Typing fixture data

TypeScript infers imported JSON shapes. When a page object accepts a subset, define an interface at the page object and pass the fixture directly:

```typescript
// cypress/page-objects/saucedemo/CheckoutPage.ts
export interface CheckoutUserInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}
```

Because the fixture shape matches, no cast is needed. Avoid `as` casts; they hide fixture drift.

---

## Best practices

| Do | Don't |
|---|---|
| Group fixtures by module | Put every file in one flat folder |
| Use descriptive keys (`validUser`, `lockedOutUser`) | Use `user1`, `user2` |
| Keep fixtures small and used | Keep unused legacy records |
| Generate unique values in the test when needed | Share one mutable object across tests |
| Store non-sensitive demo data in git | Commit real credentials or tokens |
| Use environment variables for secrets | Put secrets in JSON fixtures |

Tests should be independently runnable. Do not let one spec mutate a fixture object that another spec reads.
