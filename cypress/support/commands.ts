import { LoginPage } from '../page-objects/saucedemo/LoginPage';

/**
 * Shared UI login. Kept as one command so every spec uses the same flow.
 *
 * shortcut: SauceDemo 404s direct deep links and does not redirect on a restored
 * session, so cy.session cannot be used. Switch to cy.session if the app supports
 * deep links or session-based redirects.
 */
Cypress.Commands.add('login', (user: { username: string; password: string }) => {
  new LoginPage().visit().login(user);
  cy.url().should('include', '/inventory.html');
});
