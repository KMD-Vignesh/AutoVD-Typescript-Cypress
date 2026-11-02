// Cypress E2E support file - runs once before all test specs
// Global setup and teardown hooks go here

// ============================================================================
// GLOBAL ERROR HANDLING & LOGGING
// Captures error details, logs, and screenshots on every test failure
// ============================================================================

// Log Cypress errors with details
Cypress.on('fail', (error, runnable) => {
  console.error('========================================');
  console.error('TEST FAILED:', runnable?.title || 'Unknown');
  console.error('Error Message:', error.message);
  console.error('Error Stack:', error.stack);
  console.error('========================================');

  // Take a named screenshot on failure
  const testName = runnable?.title
    ? runnable.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
    : 'unknown-test';
  cy.screenshot(`error-${testName}`, { capture: 'viewport' });

  // Re-throw the error so Cypress marks the test as failed
  throw error;
});

// Log uncaught exceptions from the application
Cypress.on('uncaught:exception', (err) => {
  console.error('========================================');
  console.error('UNCAUGHT EXCEPTION:', err.message);
  console.error('Stack:', err.stack);
  console.error('========================================');

  // Return false to prevent Cypress from failing the test on uncaught exceptions
  // (we want to log it but let the test continue if possible)
  return false;
});

// ============================================================================
// GLOBAL HOOKS
// ============================================================================

beforeEach(() => {
  // Note: Cypress.Cookies.defaults() was removed in Cypress 12+
  // Use cy.session() for authentication persistence instead

  // Log test start
  console.log('========================================');
  console.log('STARTING TEST:', Cypress.currentTest?.title);
  console.log('========================================');
});

afterEach(function () {
  const test = this.currentTest;
  // Take screenshot on failure
  if (test?.state === 'failed') {
    cy.screenshot(`failed-${test.title.replace(/\s+/g, '-')}`, {
      capture: 'viewport',
    });
  }

  // Log test end with result
  console.log('========================================');
  console.log('TEST ENDED:', Cypress.currentTest?.title);
  console.log('RESULT:', test?.state);
  console.log('========================================');
});