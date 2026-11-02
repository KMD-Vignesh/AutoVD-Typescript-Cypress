// Custom Cypress commands for the AutoVD framework
// All commands are registered here or imported from separate modules

/**
 * Custom login command with session caching
 * Usage: cy.login({ email: 'user@test.com', password: 'secret123' })
 */
Cypress.Commands.add(
  'login',
  (credentials: { email: string; password: string }) => {
    cy.session(credentials.email, () => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(credentials.email);
      cy.get('[data-testid="password-input"]').type(credentials.password);
      cy.get('[data-testid="login-btn"]').click();
      cy.url().should('include', '/dashboard');
    }, {
      validate: () => {
        cy.getCookie('session_token').should('exist');
      },
    });
  }
);

/**
 * Custom registration command
 * Usage: cy.register({ name: 'John', email: 'john@test.com', password: 'secret123' })
 */
Cypress.Commands.add(
  'register',
  (user: { name: string; email: string; password: string }) => {
    cy.visit('/register');
    cy.get('[data-testid="name-input"]').type(user.name);
    cy.get('[data-testid="email-input"]').type(user.email);
    cy.get('[data-testid="password-input"]').type(user.password);
    cy.get('[data-testid="register-btn"]').click();
    cy.url().should('include', '/dashboard');
  }
);

/**
 * Custom assertion: element should be visible and enabled
 * Usage: cy.get('[data-testid="btn"]').assertVisibleAndEnabled()
 */
Cypress.Commands.add(
  'assertVisibleAndEnabled',
  { prevSubject: true },
  (subject) => {
    cy.wrap(subject).should('be.visible').and('not.be.disabled');
  }
);

/**
 * Custom command: wait for API response and assert status
 * Usage: cy.waitForApi('@getUsers', 200)
 */
Cypress.Commands.add(
  'waitForApi',
  (alias: string, expectedStatus: number = 200) => {
    cy.wait(alias).then((interception) => {
      expect(interception.response?.statusCode).to.eq(expectedStatus);
    });
  }
);