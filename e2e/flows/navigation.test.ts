import { device } from 'detox';
import { launchLoggedOut } from '../support/fixtures';
import { LoginScreen } from '../screens/LoginScreen';
import { ForgotPasswordScreen, SignupScreen } from '../screens/AuthScreens';

describe('Auth navigation', () => {
  beforeAll(launchLoggedOut);

  it('opens sign up and comes back to login', async () => {
    await LoginScreen.signUpButton().tap();
    await SignupScreen.waitUntilVisible();

    await device.pressBack();
    await LoginScreen.expectVisible();
  });

  it('opens forgot password and comes back to login', async () => {
    await LoginScreen.forgotPasswordButton().tap();
    await ForgotPasswordScreen.waitUntilVisible();

    await device.pressBack();
    await LoginScreen.expectVisible();
  });
});
