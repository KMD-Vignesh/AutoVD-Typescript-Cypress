/// <reference types="cypress" />

declare module 'cypress-mochawesome-reporter/plugin' {
  const initPlugin: (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => void;
  export default initPlugin;
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Log in through the UI.
     * @example cy.login({ username: 'standard_user', password: 'secret_sauce' })
     */
    login(user: { username: string; password: string }): Chainable<void>;
  }
}
