import { LoginPage } from '../../page-objects/saucedemo/LoginPage.po';
import { ProductsPage } from '../../page-objects/saucedemo/ProductsPage.po';
import * as users from '../../fixtures/saucedemo/users.json';

describe('SauceDemo - Products Module', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    productsPage = new ProductsPage();
    loginPage.visit();
    loginPage.login(users.validUser);
  });

  // Capture screenshot on test failure for debugging
  afterEach(function () {
    const test = this.currentTest;
    if (test?.state === 'failed') {
      cy.screenshot(`products-failed-${test.title.replace(/\s+/g, '-')}`);
    }
  });

  describe('Product Listing', () => {
    it('should display products page after login', () => {
      productsPage.assertProductsPageLoaded();
      productsPage.getProductNames().should('have.length.greaterThan', 0);
      productsPage.getProductPrices().should('have.length.greaterThan', 0);
    });

    it('should sort products by price low to high', () => {
      productsPage.sortBy('lohi');
      productsPage.getProductPrices().then(($prices: JQuery<HTMLElement>) => {
        const priceValues = $prices
          .toArray()
          .map((el: HTMLElement) => parseFloat(Cypress.$(el).text().replace('$', '')));
        for (let i = 0; i < priceValues.length - 1; i++) {
          expect(priceValues[i]).to.be.lte(priceValues[i + 1]);
        }
      });
    });

    it('should sort products by name Z to A', () => {
      productsPage.sortBy('za');
      productsPage.getProductNames().then(($names: JQuery<HTMLElement>) => {
        const nameValues = $names.toArray().map((el: HTMLElement) => Cypress.$(el).text());
        for (let i = 0; i < nameValues.length - 1; i++) {
          expect(nameValues[i].localeCompare(nameValues[i + 1])).to.be.gte(0);
        }
      });
    });
  });

  describe('Add to Cart', () => {
    it('should add a single product to cart', () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.assertCartBadgeCount(1);
    });

    it('should add multiple products to cart', () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.addProductToCartByName('Sauce Labs Bike Light');
      productsPage.assertCartBadgeCount(2);
    });

    it('should add all products to cart', () => {
      productsPage.getProductNames().then(($names: JQuery<HTMLElement>) => {
        productsPage.addAllProductsToCart();
        productsPage.assertCartBadgeCount($names.length);
      });
    });
  });

  describe('Sidebar Menu', () => {
    it('should open sidebar and reset app state', () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.assertCartBadgeCount(1);
      productsPage.openMenu();
      productsPage.clickResetAppState();
      productsPage.assertCartBadgeCount(0);
    });
  });
});