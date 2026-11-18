import { expect, waitFor } from 'detox';
import { launchLoggedOut } from '../support/fixtures';
import { TEST_ACCOUNT } from '../support/env';
import { TEST_DATA } from '../support/testData';
import { LoginScreen } from '../screens/LoginScreen';
import { TabBar } from '../screens/MainScreens';

// Tests run in order and share one app session: validation → wrong password → success
describe('Login', () => {
  beforeAll(launchLoggedOut);

  it('shows required errors when the form is empty', async () => {
    await LoginScreen.submitEmpty();

    await expect(LoginScreen.identifierError()).toBeVisible();
    await expect(LoginScreen.passwordError()).toBeVisible();
  });

  it('shows an inline password error for a wrong password', async () => {
    await LoginScreen.login(TEST_ACCOUNT.username, TEST_DATA.INVALID_PASSWORD);

    // Backend returns a field error ("Incorrect password."), shown under the password input
    await waitFor(LoginScreen.passwordError()).toBeVisible().withTimeout(15000);
    await LoginScreen.expectVisible();
  });

  it('logs in with valid credentials and shows the main tabs', async () => {
    await LoginScreen.login(TEST_ACCOUNT.username, TEST_ACCOUNT.password);

    await TabBar.waitUntilVisible();
  });
});
