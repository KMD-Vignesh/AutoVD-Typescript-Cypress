import { BasePage } from '../base/BasePage';

/**
 * Page Object for SauceDemo Products/Inventory Page
 */
export class ProductsPage extends BasePage {
  private readonly selectors = {
    productList: '.inventory_list',
    productItem: '.inventory_item',
    productName: '.inventory_item_name',
    productPrice: '.inventory_item_price',
    addToCartButton: '[data-test^="add-to-cart-"]',
    removeButton: '[data-test^="remove-"]',
    shoppingCartLink: '[data-test="shopping-cart-link"]',
    shoppingCartBadge: '.shopping_cart_badge',
    menuButton: '#react-burger-menu-btn',
    sidebar: '.bm-menu-wrap',
    logoutLink: '[data-test="logout-sidebar-link"]',
    resetAppLink: '[data-test="reset-sidebar-link"]',
    sortDropdown: '.product_sort_container',
    headerTitle: '.title',
  };

  /**
   * Assert products page is loaded
   */
  assertProductsPageLoaded() {
    cy.get(this.selectors.headerTitle).should('contain.text', 'Products');
    cy.get(this.selectors.productList).should('be.visible');
    cy.get(this.selectors.shoppingCartLink).should('be.visible');
    cy.get(this.selectors.menuButton).should('be.visible');
    return this;
  }

  /**
   * Get all product names
   */
  getProductNames() {
    return cy.get(this.selectors.productName);
  }

  /**
   * Get all product prices
   */
  getProductPrices() {
    return cy.get(this.selectors.productPrice);
  }

  /**
   * Add a product to cart by product name
   * @param productName - Name of the product to add to cart
   */
  addProductToCartByName(productName: string) {
    cy.contains('.inventory_item', productName).find(this.selectors.addToCartButton).click();
    return this;
  }

  /**
   * Add all products to cart
   */
  addAllProductsToCart() {
    cy.get(this.selectors.addToCartButton).each(($btn) => {
      cy.wrap($btn).click();
    });
    return this;
  }

  /**
   * Get shopping cart badge count
   */
  getCartBadgeCount() {
    return cy.get(this.selectors.shoppingCartBadge);
  }

  /**
   * Assert cart badge shows expected count
   * @param count - Expected number of items (use 0 to assert badge is not present)
   */
  assertCartBadgeCount(count: number) {
    if (count === 0) {
      // SauceDemo removes the badge element when the cart is empty
      cy.get(this.selectors.shoppingCartBadge).should('not.exist');
      return this;
    }
    cy.get(this.selectors.shoppingCartBadge).should('have.text', count.toString());
    return this;
  }

  /**
   * Click shopping cart link to go to cart page
   */
  clickShoppingCart() {
    cy.get(this.selectors.shoppingCartLink).click();
    return this;
  }

  /**
   * Open the sidebar menu
   */
  openMenu() {
    cy.get(this.selectors.menuButton).should('be.visible').click();
    cy.get(this.selectors.sidebar).should('be.visible');
    return this;
  }

  /**
   * Click logout from sidebar menu
   */
  clickLogout() {
    cy.get(this.selectors.logoutLink).click();
    return this;
  }

  /**
   * Click reset app state from sidebar menu
   */
  clickResetAppState() {
    cy.get(this.selectors.resetAppLink).click();
    return this;
  }

  /**
   * Sort products by option value
   * @param value - Sort option value (az, za, lohi, hilo)
   */
  sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    cy.get(this.selectors.sortDropdown).select(value);
    return this;
  }
}
