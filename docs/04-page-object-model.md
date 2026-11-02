# 04 - Page Object Model (POM)

Page objects keep selectors and page actions out of specs. Each page or reusable component gets one class under `cypress/page-objects/`.

---

## Base page

`BasePage` contains only behavior shared by every page. In this framework that is navigation:

```typescript
// cypress/page-objects/base/BasePage.ts
export class BasePage {
  visit(path = '') {
    cy.visit(path);
    return this;
  }
}
```

Do not add generic helpers that no page uses. A small base class is easier to maintain than a utility drawer.

---

## Example: Login page

```typescript
// cypress/page-objects/saucedemo/LoginPage.ts
import { BasePage } from '../base/BasePage';

export interface LoginCredentials {
  username: string;
  password: string;
}

export class LoginPage extends BasePage {
  private readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    loginLogo: '.login_logo',
  };

  visit() {
    cy.visit('/');
    return this;
  }

  enterUsername(username: string) {
    cy.get(this.selectors.usernameInput).clear();
    cy.get(this.selectors.usernameInput).type(username);
    return this;
  }

  enterPassword(password: string) {
    cy.get(this.selectors.passwordInput).clear();
    cy.get(this.selectors.passwordInput).type(password);
    return this;
  }

  clickLogin() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  login(credentials: LoginCredentials) {
    this.enterUsername(credentials.username)
      .enterPassword(credentials.password)
      .clickLogin();
    return this;
  }

  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  assertErrorMessageVisible() {
    cy.get(this.selectors.errorMessage).should('be.visible');
    return this;
  }
}
```

Rules used here:

- Selectors are `private readonly` and grouped in one object.
- Actions return `this` so callers can chain.
- Getters return Cypress chains for assertions.
- Assertions that are page-specific live on the page object; scenario assertions stay in specs.

---

## Using page objects in specs

```typescript
// cypress/e2e/saucedemo/login.cy.ts
import { LoginPage } from '../../page-objects/saucedemo/LoginPage';
import * as users from '../../fixtures/saucedemo/users.json';

describe('SauceDemo - Login Module', () => {
  const loginPage = new LoginPage();

  it('should show an error for invalid credentials', () => {
    loginPage.visit();
    loginPage.login(users.invalidUser);
    loginPage.assertErrorMessageVisible();
    loginPage
      .getErrorMessage()
      .should('contain.text', 'Username and password do not match');
  });
});
```

Specs that start from an authenticated session use the shared command:

```typescript
beforeEach(() => {
  cy.login(users.validUser);
});
```

A codebase should not mix both login styles in the same spec. Login specs exercise the UI; all other specs use `cy.login`.

---

## Chaining

Actions return `this`:

```typescript
loginPage
  .visit()
  .enterUsername('standard_user')
  .enterPassword('secret_sauce')
  .clickLogin();
```

Getters return Cypress chains:

```typescript
productsPage.getProductNames().should('have.length.greaterThan', 0);
```

Do not return `cy` from an action and then try to chain page-object methods on it. Pick one style per method.

---

## Folder structure

```
cypress/page-objects/
├── base/
│   └── BasePage.ts
└── saucedemo/
    ├── LoginPage.ts
    ├── ProductsPage.ts
    ├── CartPage.ts
    └── CheckoutPage.ts
```

For a new module:

```
cypress/page-objects/<module>/
└── <PageName>.ts
```

Use the class name as the file name. The folder already communicates that these are page objects.

---

## Adding a page object

1. Create `<Name>Page.ts` under the module.
2. Extend `BasePage` if the page needs navigation.
3. Add a `private readonly selectors` object.
4. Add actions returning `this` and getters returning Cypress chains.
5. Use it from a spec; do not put selectors back in the spec.

---

## Do and don't

| Do | Don't |
|---|---|
| Keep selectors private and grouped | Export selectors to specs |
| Return `this` from actions | Return raw `cy` chains from actions |
| Keep one class per page/component | Build a `CommonPage` with everything |
| Name methods after user intent (`addProductToCartByName`) | Name them after implementation (`clickThirdButton`) |
| Put page-level assertions on the page object | Put business scenarios in the page object |
| Keep `BasePage` small | Add unused "just in case" helpers |
