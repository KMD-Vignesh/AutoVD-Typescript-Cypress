/**
 * Base Page Object class with common methods shared across all pages.
 * Extend this class to create page-specific page objects.
 */
export class BasePage {
  /**
   * Visit a URL path relative to baseUrl
   * @param path - URL path to visit (default: root)
   */
  visit(path: string = '') {
    cy.visit(path);
    return this;
  }

  /**
   * Get an element by data-testid attribute
   * @param testId - The data-testid value
   */
  getByTestId(testId: string) {
    return cy.get(`[data-testid="${testId}"]`);
  }

  /**
   * Wait for an element to be visible
   * @param testId - The data-testid value
   * @param timeout - Custom timeout in milliseconds
   */
  waitForVisible(testId: string, timeout = 10000) {
    return cy
      .get(`[data-testid="${testId}"]`, { timeout })
      .should('be.visible');
  }

  /**
   * Wait for an element to not exist in the DOM
   * @param testId - The data-testid value
   * @param timeout - Custom timeout in milliseconds
   */
  waitForNotExist(testId: string, timeout = 10000) {
    return cy
      .get(`[data-testid="${testId}"]`, { timeout })
      .should('not.exist');
  }

  /**
   * Click an element by data-testid
   * @param testId - The data-testid value
   */
  clickByTestId(testId: string) {
    return cy.get(`[data-testid="${testId}"]`).click();
  }

  /**
   * Type text into an input by data-testid
   * @param testId - The data-testid value
   * @param text - Text to type
   */
  typeByTestId(testId: string, text: string) {
    return cy.get(`[data-testid="${testId}"]`).type(text);
  }

  /**
   * Assert element contains specific text
   * @param testId - The data-testid value
   * @param text - Expected text
   */
  assertContainsText(testId: string, text: string) {
    return cy
      .get(`[data-testid="${testId}"]`)
      .should('contain.text', text);
  }
}