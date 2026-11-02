import { LoginPage } from '../../page-objects/saucedemo/LoginPage.po';
import { ProductsPage } from '../../page-objects/saucedemo/ProductsPage.po';
import { CartPage } from '../../page-objects/saucedemo/CartPage.po';
import { CheckoutPage } from '../../page-objects/saucedemo/CheckoutPage.po';
import * as users from '../../fixtures/saucedemo/users.json';
import * as checkoutInfo from '../../fixtures/saucedemo/checkout-info.json';

describe('SauceDemo - Checkout Module', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    productsPage = new ProductsPage();
    cartPage = new CartPage();
    checkoutPage = new CheckoutPage();
    loginPage.visit();
    loginPage.login(users.validUser);
  });

  describe('Checkout Flow', () => {
    it('should complete a full checkout flow with one product', () => {
      // Add product to cart
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.assertCartBadgeCount(1);

      // Go to cart
      productsPage.clickShoppingCart();
      cartPage.assertCartPageLoaded();
      cartPage.assertCartItemCount(1);

      // Proceed to checkout
      cartPage.clickCheckout();
      checkoutPage.assertCheckoutStep1Loaded();

      // Fill information
      checkoutPage.fillCheckoutInformation(checkoutInfo.validInfo);
      checkoutPage.clickContinueStep1();

      // Checkout overview
      checkoutPage.assertCheckoutStep2Loaded();

      // Finish order
      checkoutPage.clickFinish();
      checkoutPage.assertCheckoutCompleteLoaded();
    });

    it('should show error when checkout info is incomplete', () => {
      productsPage.addProductToCartByName('Sauce Labs Backpack');
      productsPage.clickShoppingCart();
      cartPage.clickCheckout();
      checkoutPage.assertCheckoutStep1Loaded();

      // Submit with empty info - leave all fields empty
      checkoutPage.fillCheckoutInformationEmpty();
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