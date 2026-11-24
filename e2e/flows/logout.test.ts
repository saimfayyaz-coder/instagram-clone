import { launchLoggedIn } from '../support/fixtures';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen, SettingsScreen, TabBar } from '../screens/MainScreens';

describe('Logout', () => {
  // Wrapped: Jest treats a function with a parameter as a done-callback hook
  beforeAll(async () => {
    await launchLoggedIn();
  });

  it('logs out from settings and returns to the login screen', async () => {
    await TabBar.openProfile();
    await ProfileScreen.openSettings();
    await SettingsScreen.logout();

    await LoginScreen.waitUntilVisible();
  });
});
