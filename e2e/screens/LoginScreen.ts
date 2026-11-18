import { by, element, expect, waitFor } from 'detox';
import { TEST_IDS, TEST_ID_ERROR_SUFFIX } from '@/shared/constants/testIds';

const ids = TEST_IDS.LOGIN;

export const LoginScreen = {
  identifierInput: () => element(by.id(ids.IDENTIFIER_INPUT)),
  passwordInput: () => element(by.id(ids.PASSWORD_INPUT)),
  submitButton: () => element(by.id(ids.SUBMIT_BUTTON)),
  forgotPasswordButton: () => element(by.id(ids.FORGOT_PASSWORD_BUTTON)),
  signUpButton: () => element(by.id(ids.SIGN_UP_BUTTON)),
  identifierError: () => element(by.id(`${ids.IDENTIFIER_INPUT}${TEST_ID_ERROR_SUFFIX}`)),
  passwordError: () => element(by.id(`${ids.PASSWORD_INPUT}${TEST_ID_ERROR_SUFFIX}`)),

  async waitUntilVisible() {
    // First launch includes the splash screen and loading JS
    await waitFor(this.identifierInput()).toBeVisible().withTimeout(30000);
  },

  async expectVisible() {
    await expect(this.identifierInput()).toBeVisible();
    await expect(this.submitButton()).toBeVisible();
  },

  async login(username: string, password: string) {
    await this.identifierInput().replaceText(username);
    await this.passwordInput().replaceText(password);
    await this.submitButton().tap();
  },

  async submitEmpty() {
    await this.identifierInput().clearText();
    await this.passwordInput().clearText();
    await this.submitButton().tap();
  },
};
