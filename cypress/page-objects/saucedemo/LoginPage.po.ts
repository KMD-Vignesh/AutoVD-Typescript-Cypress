import { BasePage } from '../base/BasePage.po';

interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Page Object for SauceDemo Login Page
 */
export class LoginPage extends BasePage {
  private readonly selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    errorButton: '[data-test="error-button"]',
    loginLogo: '.login_logo',
  };

  /**
   * Navigate to the SauceDemo login page
   */
  visit() {
    cy.visit('/');
    return this;
  }

  /**
   * Enter username
   * @param username - Username to type
   */
  enterUsername(username: string) {
    cy.get(this.selectors.usernameInput).clear().type(username);
    return this;
  }

  /**
   * Enter password
   * @param password - Password to type
   */
  enterPassword(password: string) {
    cy.get(this.selectors.passwordInput).clear().type(password);
    return this;
  }

  /**
   * Click the login button
   */
  clickLogin() {
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  /**
   * Perform full login flow
   * @param credentials - Login credentials { username, password }
   */
  login(credentials: LoginCredentials) {
    this.enterUsername(credentials.username)
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
   * @param text - Expected error text
   */
  assertErrorMessageContains(text: string) {
    cy.get(this.selectors.errorMessage).should('contain.text', text);
    return this;
  }

  /**
   * Assert login page is loaded
   */
  assertLoginPageLoaded() {
    cy.get(this.selectors.loginLogo).should('be.visible');
    cy.get(this.selectors.usernameInput).should('be.visible');
    cy.get(this.selectors.passwordInput).should('be.visible');
    cy.get(this.selectors.loginButton).should('be.visible');
    return this;
  }
}