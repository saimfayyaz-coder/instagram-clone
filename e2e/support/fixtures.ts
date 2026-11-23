import { device } from 'detox';
import { TEST_ACCOUNT } from './env';
import { LoginScreen } from '../screens/LoginScreen';
import { TabBar } from '../screens/MainScreens';

// Reusable starting states for tests (like Playwright fixtures).
// Each reinstalls the app, so storage (MMKV, Keychain) is empty and files stay independent.

export const launchLoggedOut = async () => {
  await device.launchApp({ newInstance: true, delete: true });
  await LoginScreen.waitUntilVisible();
};

export const launchLoggedIn = async () => {
  await launchLoggedOut();
  await LoginScreen.login(TEST_ACCOUNT.username, TEST_ACCOUNT.password);
  await TabBar.waitUntilVisible();
};
