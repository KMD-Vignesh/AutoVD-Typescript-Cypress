import { ProductsPage } from '../../page-objects/saucedemo/ProductsPage';
import { CartPage } from '../../page-objects/saucedemo/CartPage';
import { CheckoutPage } from '../../page-objects/saucedemo/CheckoutPage';
import * as users from '../../fixtures/saucedemo/users.json';
import * as checkoutInfo from '../../fixtures/saucedemo/checkout-info.json';

describe('SauceDemo - Checkout Module', () => {
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    cy.login(users.validUser);
  });

  describe('Checkout Flow', () => {
    it('should complete a full checkout flow with one product', { tags: '@smoke' }, () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.assertCartBadgeCount(1);

      productsPage.clickShoppingCart();
      cartPage.assertCartPageLoaded();
      cartPage.assertCartItemCount(1);

      cartPage.clickCheckout();
      checkoutPage.assertCheckoutStep1Loaded();

      checkoutPage.fillCheckoutInformation(checkoutInfo.validInfo);
      checkoutPage.clickContinueStep1();

      checkoutPage.assertCheckoutStep2Loaded();
      checkoutPage.clickFinish();
      checkoutPage.assertCheckoutCompleteLoaded();
    });

    it('should show error when checkout info is incomplete', () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.clickShoppingCart();
      cartPage.clickCheckout();
      checkoutPage.assertCheckoutStep1Loaded();

      checkoutPage.clickContinueStep1();
      checkoutPage.getCheckoutErrorMessage().should('be.visible');
    });

    it('should continue shopping from cart page', () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.clickShoppingCart();
      cartPage.assertCartPageLoaded();
      cartPage.clickContinueShopping();
      productsPage.assertProductsPageLoaded();
    });

    it('should remove item from cart', () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.clickShoppingCart();
      cartPage.assertCartItemCount(1);
      cartPage.removeProductFromCart('Sauce Labs Backpack');
      cartPage.assertCartItemCount(0);
    });
  });
});
