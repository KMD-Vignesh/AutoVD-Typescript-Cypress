import { ProductsPage } from '../../page-objects/saucedemo/ProductsPage';
import * as users from '../../fixtures/saucedemo/users.json';

describe('SauceDemo - Products Module', () => {
  const productsPage = new ProductsPage();

  beforeEach(() => {
    cy.login(users.validUser);
  });

  describe('Product Listing', () => {
    it('should display products page after login', () => {
      productsPage.assertProductsPageLoaded();
      productsPage.getProductNames().should('have.length.greaterThan', 0);
      productsPage.getProductPrices().should('have.length.greaterThan', 0);
    });

    it('should sort products by price low to high', () => {
      productsPage.sortBy('lohi');
      productsPage.getProductPrices().should(($prices) => {
        const prices = $prices.toArray().map((el) => Number(el.innerText.replace('$', '')));
        prices.forEach((price, index) => {
          if (index > 0) {
            expect(price).to.be.gte(prices[index - 1]);
          }
        });
      });
    });

    it('should sort products by name Z to A', () => {
      productsPage.sortBy('za');
      productsPage.getProductNames().should(($names) => {
        const names = $names.toArray().map((el) => el.innerText);
        names.forEach((name, index) => {
          if (index > 0) {
            expect(names[index - 1].localeCompare(name)).to.be.gte(0);
          }
        });
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
      productsPage.getProductNames().then(($names) => {
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
