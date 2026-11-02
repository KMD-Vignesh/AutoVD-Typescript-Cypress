import { BasePage } from '../base/BasePage';

export interface CheckoutUserInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

/**
 * Page Object for SauceDemo Checkout Pages (Step 1, Step 2, Complete)
 */
export class CheckoutPage extends BasePage {
  // Checkout Step 1: Your Information
  private readonly step1Selectors = {
    headerTitle: '.title',
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    zipCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    errorMessage: '[data-test="error"]',
  };

  // Checkout Step 2: Overview
  private readonly step2Selectors = {
    headerTitle: '.title',
    cartItem: '.cart_item',
    itemTotal: '.summary_subtotal_label',
    tax: '.summary_tax_label',
    total: '.summary_total_label',
    finishButton: '[data-test="finish"]',
    cancelButton: '[data-test="cancel"]',
  };

  // Checkout Complete
  private readonly completeSelectors = {
    headerTitle: '.title',
    completeHeader: '.complete-header',
    completeText: '.complete-text',
    backHomeButton: '[data-test="back-to-home"]',
    ponyExpressImage: '.pony_express',
  };

  /**
   * Assert checkout step 1 page is loaded
   */
  assertCheckoutStep1Loaded() {
    cy.get(this.step1Selectors.headerTitle).should('contain.text', 'Checkout: Your Information');
    cy.get(this.step1Selectors.firstNameInput).should('be.visible');
    cy.get(this.step1Selectors.lastNameInput).should('be.visible');
    cy.get(this.step1Selectors.zipCodeInput).should('be.visible');
    return this;
  }

  /**
   * Fill checkout information
   * @param info - Checkout user info { firstName, lastName, zipCode }
   */
  fillCheckoutInformation(info: CheckoutUserInfo) {
    if (info.firstName) {
      cy.get(this.step1Selectors.firstNameInput).type(info.firstName);
    }
    if (info.lastName) {
      cy.get(this.step1Selectors.lastNameInput).type(info.lastName);
    }
    if (info.zipCode) {
      cy.get(this.step1Selectors.zipCodeInput).type(info.zipCode);
    }
    return this;
  }

  /**
   * Click continue on step 1
   */
  clickContinueStep1() {
    cy.get(this.step1Selectors.continueButton).click();
    return this;
  }

  /**
   * Assert checkout step 2 page is loaded
   */
  assertCheckoutStep2Loaded() {
    cy.get(this.step2Selectors.headerTitle).should('contain.text', 'Checkout: Overview');
    cy.get(this.step2Selectors.finishButton).should('be.visible');
    return this;
  }

  /**
   * Get checkout total amount
   */
  getCheckoutTotal() {
    return cy.get(this.step2Selectors.total);
  }

  /**
   * Click finish button to complete order
   */
  clickFinish() {
    cy.get(this.step2Selectors.finishButton).click();
    return this;
  }

  /**
   * Assert checkout complete page is loaded
   */
  assertCheckoutCompleteLoaded() {
    cy.get(this.completeSelectors.headerTitle).should('contain.text', 'Checkout: Complete!');
    cy.get(this.completeSelectors.completeHeader).should(
      'contain.text',
      'Thank you for your order!'
    );
    cy.get(this.completeSelectors.ponyExpressImage).should('be.visible');
    return this;
  }

  /**
   * Click back home button
   */
  clickBackHome() {
    cy.get(this.completeSelectors.backHomeButton).click();
    return this;
  }

  /**
   * Get error message on checkout step 1
   */
  getCheckoutErrorMessage() {
    return cy.get(this.step1Selectors.errorMessage);
  }
}
