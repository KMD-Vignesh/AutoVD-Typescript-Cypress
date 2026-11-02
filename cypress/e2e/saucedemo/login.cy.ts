import { LoginPage } from '../../page-objects/saucedemo/LoginPage';
import * as users from '../../fixtures/saucedemo/users.json';

describe('SauceDemo - Login Module', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
  });

  describe('Valid Login', () => {
    it('should successfully log in with standard_user credentials', () => {
      loginPage.visit();
      loginPage.assertLoginPageLoaded();
      loginPage.login(users.validUser);
      cy.url().should('include', '/inventory.html');
    });
  });

  describe('Invalid Login', () => {
    it('should show error message with invalid credentials', () => {
      loginPage.visit();
      loginPage.login(users.invalidUser);
      loginPage.assertErrorMessageVisible();
      loginPage.assertErrorMessageContains('Username and password do not match');
    });

    it('should show error message when username is empty', () => {
      loginPage.visit();
      // Username field is left empty by default on fresh page visit
      loginPage.enterPassword(users.validUser.password);
      loginPage.clickLogin();
      loginPage.assertErrorMessageVisible();
      loginPage.assertErrorMessageContains('Username is required');
    });

    it('should show error message when password is empty', () => {
      loginPage.visit();
      loginPage.enterUsername(users.validUser.username);
      // Password field is left empty by default on fresh page visit
      loginPage.clickLogin();
      loginPage.assertErrorMessageVisible();
      loginPage.assertErrorMessageContains('Password is required');
    });

    it('should show error message for locked out user', () => {
      loginPage.visit();
      loginPage.login(users.lockedOutUser);
      loginPage.assertErrorMessageVisible();
      loginPage.assertErrorMessageContains('Sorry, this user has been locked out');
    });
  });
});
