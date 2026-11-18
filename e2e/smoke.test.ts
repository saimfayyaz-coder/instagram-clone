import { launchLoggedOut } from './support/fixtures';
import { LoginScreen } from './screens/LoginScreen';

describe('Smoke', () => {
  it('launches the app and shows the login screen', async () => {
    await launchLoggedOut();
    await LoginScreen.expectVisible();
  });
});
