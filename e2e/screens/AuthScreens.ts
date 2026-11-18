import { by, element, waitFor } from 'detox';
import { TEST_IDS } from '@/shared/constants/testIds';

export const SignupScreen = {
  usernameInput: () => element(by.id(TEST_IDS.SIGNUP.USERNAME_INPUT)),

  async waitUntilVisible() {
    await waitFor(this.usernameInput()).toBeVisible().withTimeout(10000);
  },
};

export const ForgotPasswordScreen = {
  identifierInput: () => element(by.id(TEST_IDS.FORGOT_PASSWORD.IDENTIFIER_INPUT)),

  async waitUntilVisible() {
    await waitFor(this.identifierInput()).toBeVisible().withTimeout(10000);
  },
};
