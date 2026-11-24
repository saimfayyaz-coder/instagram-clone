import { device } from 'detox';
import { TestApi, TestUser } from './testApi';
import { LoginScreen } from '../screens/LoginScreen';
import { TabBar } from '../screens/MainScreens';

// Reusable starting states for tests (like Playwright fixtures).
// Each reinstalls the app, so storage (MMKV, Keychain) is empty and files stay independent.

export const launchLoggedOut = async () => {
  await device.launchApp({ newInstance: true, delete: true });
  await LoginScreen.waitUntilVisible();
};

// Creates a fresh user through the test API, logs in as them and returns the user
export const launchLoggedIn = async (options?: { withPost?: boolean }): Promise<TestUser> => {
  const user = await TestApi.createUser(options);
  await launchLoggedOut();
  await LoginScreen.login(user.username, user.password);
  await TabBar.waitUntilVisible();
  return user;
};
