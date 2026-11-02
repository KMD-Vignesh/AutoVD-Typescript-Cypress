import { BasePage } from '../base/BasePage.po';

/**
 * Page Object for SauceDemo Cart Page
 */
export class CartPage extends BasePage {
  private readonly selectors = {
    headerTitle: '.title',
    cartItem: '.cart_item',
    cartItemName: '.inventory_item_name',
    cartItemPrice: '.inventory_item_price',
    removeButton: '[data-test^="remove-"]',
    checkoutButton: '[data-test="checkout"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    cartList: '.cart_list',
  };

  /**
   * Assert cart page is loaded
   */
  assertCartPageLoaded() {
    cy.get(this.selectors.headerTitle).should('contain.text', 'Your Cart');
    cy.get(this.selectors.cartList).should('be.visible');
    return this;
  }

  /**
   * Get all cart item names
   */
  getCartItemNames() {
    return cy.get(this.selectors.cartItemName);
  }

  /**
   * Get all cart item prices
   */
  getCartItemPrices() {
    return cy.get(this.selectors.cartItemPrice);
  }

  /**
   * Assert cart contains expected number of items
   * @param count - Expected number of items
   */
  assertCartItemCount(count: number) {
    cy.get(this.selectors.cartItem).should('have.length', count);
    return this;
  }

  /**
   * Remove an item from cart by product name
   * @param productName - Name of the product to remove
   */
  removeProductFromCart(productName: string) {
    cy.contains('.cart_item', productName)
      .find(this.selectors.removeButton)
      .click();
    return this;
  }

  /**
   * Click checkout button
   */
  clickCheckout() {
    cy.get(this.selectors.checkoutButton).click();
    return this;
  }

  /**
   * Click continue shopping button
   */
  clickContinueShopping() {
    cy.get(this.selectors.continueShoppingButton).click();
    return this;
  }
}