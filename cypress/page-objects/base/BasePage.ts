/**
 * Base class for page objects. Keeps navigation in one place.
 */
export class BasePage {
  visit(path = '') {
    cy.visit(path);
    return this;
  }
}
