# 04 - Page Object Model (POM) Guide

This document explains how to implement and maintain Page Object Models in the AutoVD Cypress TypeScript framework.

---

## What is Page Object Model?

Page Object Model is a design pattern that creates an object repository for UI elements. Each web page (or component) gets a class that contains:

---

## Base Page Class

Create a `BasePage` class with common methods shared across all pages:

```typescript
// cypress/page-objects/base/BasePage.po.ts
export class BasePage {
  /**
   * Visit a URL path
   */
  visit(path: string = '') {
    cy.visit(path);
    return this;
  }

  /**
   * Get an element by data-testid
   */
  getByTestId(testId: string) {
    return cy.get(`[data-testid="${testId}"]`);
  }

  /**
   * Wait for an element to be visible
   */
  waitForVisible(testId: string, timeout = 10000) {
    return cy.get(`[data-testid="${testId}"]`, { timeout }).should('be.visible');
  }


---

## Example: Login Page Object

```typescript
// cypress/page-objects/auth/LoginPage.po.ts
import { BasePage } from '../base/BasePage';

interface LoginCredentials {
  email: string;
  password: string;
}

export class LoginPage extends BasePage {
  private readonly selectors = {
    emailInput: '[data-testid="login-email-input"]',
    passwordInput: '[data-testid="login-password-input"]',
    loginButton: '[data-testid="login-submit-btn"]',
    errorMessage: '[data-testid="login-error-msg"]',
    rememberMe: '[data-testid="login-remember-me"]',
    forgotPasswordLink: '[data-testid="login-forgot-password"]',
  };

  /**
   * Navigate to the login page
   */
  visit() {
    cy.visit('/login');
    return this;
  }

  /**
   * Enter email address
   */
  enterEmail(email: string) {
    cy.get(this.selectors.emailInput).clear().type(email);
    return this;
  }

  /**
   * Enter password
   */
  enterPassword(password: string) {
    cy.get(this.selectors.passwordInput).clear().type(password);
    return this;
  }

  /**
   * Click the login/submit button
   */
  clickLogin() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  /**
   * Toggle remember me checkbox
   */
  toggleRememberMe(shouldCheck: boolean = true) {
    cy.get(this.selectors.rememberMe).check(shouldCheck);
    return this;
  }

  /**
   * Click forgot password link
   */
  clickForgotPassword() {

---

## Example: Dashboard Page Object

```typescript
// cypress/page-objects/dashboard/DashboardPage.po.ts
import { BasePage } from '../base/BasePage';

export class DashboardPage extends BasePage {
  private readonly selectors = {
    welcomeMessage: '[data-testid="dashboard-welcome"]',
    userProfileDropdown: '[data-testid="dashboard-user-profile"]',
    logoutButton: '[data-testid="dashboard-logout-btn"]',
    sidebarNav: '[data-testid="dashboard-sidebar"]',
    createWidgetButton: '[data-testid="dashboard-create-widget"]',
    widgetList: '[data-testid="dashboard-widget-list"]',
  };

  visit() {
    cy.visit('/dashboard');
    return this;
  }

  getWelcomeMessage() {
    return cy.get(this.selectors.welcomeMessage);
  }

  assertWelcomeMessageContains(name: string) {
    cy.get(this.selectors.welcomeMessage).should('contain.text', name);
    return this;
  }

  openUserProfile() {
    cy.get(this.selectors.userProfileDropdown).click();
    return this;
  }

  clickLogout() {
    cy.get(this.selectors.logoutButton).click();
    return this;
  }

  assertSidebarVisible() {
    cy.get(this.selectors.sidebarNav).should('be.visible');
    return this;
  }

  clickCreateWidget() {
    cy.get(this.selectors.createWidgetButton).click();
    return this;
  }

  assertWidgetCount(expectedCount: number) {
    cy.get(this.selectors.widgetList).should('have.length', expectedCount);
    return this;
  }
}
```

---

## Using Page Objects in Tests

```typescript
// cypress/e2e/auth/login.cy.ts
import { LoginPage } from '../../page-objects/auth/LoginPage';
import * as users from '../../fixtures/auth/users.json';

describe('Login Module', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
  });

  describe('Valid Login', () => {
    it('should successfully log in with valid credentials', () => {
      loginPage.visit();
      loginPage.login(users.validUser);
      
      // Assertions
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Invalid Login', () => {
    it('should show error message with invalid credentials', () => {
      loginPage.visit();
      loginPage.login(users.invalidUser);
      
      loginPage.assertErrorMessageVisible();
      loginPage.assertErrorMessageContains('Invalid credentials');
    });
  });
});
```

---

## Chaining Pattern

Page object methods should return `this` to enable method chaining:

```typescript
// ✅ Chainable
loginPage
  .visit()
  .enterEmail('user@test.com')
  .enterPassword('password123')
  .clickLogin();

// ✅ Also works for assertions
dashboardPage
  .visit()
  .assertSidebarVisible()
  .assertWelcomeMessageContains('John');
```

---

## Folder Structure for Page Objects

```
cypress/page-objects/
├── base/
│   └── BasePage.po.ts        # Base class with shared methods
├── auth/
│   ├── LoginPage.po.ts
│   ├── RegisterPage.po.ts
│   └── LogoutPage.po.ts
├── dashboard/
│   └── DashboardPage.po.ts
├── users/
│   ├── UserProfilePage.po.ts
│   └── UserSettingsPage.po.ts
└── common/
    ├── Navbar.po.ts
    ├── Footer.po.ts
    └── Modal.po.ts
```

---

## Do's and Don'ts

| Do | Don't |
|----|-------|
| Encapsulate selectors in page objects | Put selectors directly in test specs |
| Return `this` from methods for chaining | Return `cy` chains from page methods |
| Use descriptive method names (`enterEmail`, `clickSubmit`) | Use vague names (`type1`, `click2`) |
| Keep page objects focused on one page/component | Create one giant `AllPages.po.ts` |
| Extend `BasePage` for shared functionality | Duplicate common methods in every page |
| Use private selectors, public methods | Expose selectors publicly |
    cy.get(this.selectors.forgotPasswordLink).click();
    return this;
  }

  /**
   * Perform full login flow
   */
  login(credentials: LoginCredentials) {
    this.enterEmail(credentials.email)
      .enterPassword(credentials.password)
      .clickLogin();
    return this;
  }

  /**
   * Get the error message element
   */
  getErrorMessage() {
    return cy.get(this.selectors.errorMessage);
  }

  /**
   * Assert error message is visible
   */
  assertErrorMessageVisible() {
    cy.get(this.selectors.errorMessage).should('be.visible');
    return this;
  }

  /**
   * Assert error message contains specific text
   */
  assertErrorMessageContains(text: string) {
    cy.get(this.selectors.errorMessage).should('contain.text', text);
    return this;
  }
}
```
  /**
   * Wait for an element to not exist
   */
  waitForNotExist(testId: string, timeout = 10000) {
    return cy.get(`[data-testid="${testId}"]`, { timeout }).should('not.exist');
  }

  /**
   * Click an element by data-testid
   */
  clickByTestId(testId: string) {
    return cy.get(`[data-testid="${testId}"]`).click();
  }

  /**
   * Type into an input by data-testid
   */
  typeByTestId(testId: string, text: string) {
    return cy.get(`[data-testid="${testId}"]`).type(text);
  }

  /**
   * Assert element contains text
   */
  assertContainsText(testId: string, text: string) {
    return cy.get(`[data-testid="${testId}"]`).should('contain.text', text);
  }
}
```

- **Selectors** (locators) for elements on the page
- **Methods** that perform actions on those elements
- Optional verification/assertion methods

Benefits:
- ✅ UI changes are isolated to one file
- ✅ Test code is readable and maintainable
- ✅ Reusable across multiple test specs
- ✅ Type-safe with TypeScript interfaces