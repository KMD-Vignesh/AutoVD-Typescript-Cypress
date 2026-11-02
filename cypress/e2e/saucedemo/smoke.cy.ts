import { LoginPage } from '../../page-objects/saucedemo/LoginPage.po';
import { ProductsPage } from '../../page-objects/saucedemo/ProductsPage.po';
import { CartPage } from '../../page-objects/saucedemo/CartPage.po';
import { CheckoutPage } from '../../page-objects/saucedemo/CheckoutPage.po';
import * as users from '../../fixtures/saucedemo/users.json';
import * as checkoutInfo from '../../fixtures/saucedemo/checkout-info.json';

describe('SauceDemo - Smoke Test Suite', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    productsPage = new ProductsPage();
    cartPage = new CartPage();
    checkoutPage = new CheckoutPage();
  });

  it('should verify critical end-to-end flow: login -> add to cart -> checkout complete', () => {
    // Login
    loginPage.visit();
    loginPage.assertLoginPageLoaded();
    loginPage.login(users.validUser);
    cy.url().should('include', '/inventory.html');

    // Products
    productsPage.assertProductsPageLoaded();
    productsPage.addProductToCartByName('Sauce Labs Backpack');
    productsPage.assertCartBadgeCount(1);

    // Cart
    productsPage.clickShoppingCart();
    cartPage.assertCartPageLoaded();
    cartPage.assertCartItemCount(1);
    cartPage.clickCheckout();

    // Checkout
    checkoutPage.assertCheckoutStep1Loaded();
    checkoutPage.fillCheckoutInformation(checkoutInfo.validInfo);
    checkoutPage.clickContinueStep1();
    checkoutPage.assertCheckoutStep2Loaded();
    checkoutPage.clickFinish();
    checkoutPage.assertCheckoutCompleteLoaded();

    // Final verification
    cy.url().should('include', '/checkout-complete.html');
  });
});