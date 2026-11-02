/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom login command with session caching
     * @param credentials - User credentials { email, password }
     * @example cy.login({ email: 'user@test.com', password: 'secret123' })
     */
    login(credentials: { email: string; password: string }): Chainable<void>;

    /**
     * Custom registration command
     * @param user - User registration data
     * @example cy.register({ name: 'John', email: 'john@test.com', password: 'secret123' })
     */
    register(user: {
      name: string;
      email: string;
      password: string;
    }): Chainable<void>;

    /**
     * Assert element is visible and enabled
     * @example cy.get('[data-testid="btn"]').assertVisibleAndEnabled()
     */
    assertVisibleAndEnabled(): Chainable<void>;

    /**
     * Wait for API response and assert status code
     * @param alias - The cy.intercept alias
     * @param expectedStatus - Expected HTTP status code (default 200)
     * @example cy.waitForApi('@getUsers', 200)
     */
    waitForApi(alias: string, expectedStatus?: number): Chainable<void>;
  }
}