import { by, element, waitFor } from 'detox';
import { TEST_IDS } from '@/shared/constants/testIds';

export const TabBar = {
  feedTab: () => element(by.id(TEST_IDS.TABS.FEED)),
  profileTab: () => element(by.id(TEST_IDS.TABS.PROFILE)),

  async waitUntilVisible() {
    // After login: API call + navigation to the main tabs
    await waitFor(this.feedTab()).toBeVisible().withTimeout(20000);
  },

  async openProfile() {
    await this.profileTab().tap();
  },
};

export const ProfileScreen = {
  menuButton: () => element(by.id(TEST_IDS.HEADER.MENU)),

  async openSettings() {
    await waitFor(this.menuButton()).toBeVisible().withTimeout(10000);
    await this.menuButton().tap();
  },
};

export const SettingsScreen = {
  logoutRow: () => element(by.id(TEST_IDS.SETTINGS.LOGOUT)),
  logoutConfirm: () => element(by.id(TEST_IDS.SETTINGS.LOGOUT_CONFIRM)),

  async logout() {
    await waitFor(this.logoutRow()).toBeVisible().withTimeout(10000);
    await this.logoutRow().tap();
    await waitFor(this.logoutConfirm()).toBeVisible().withTimeout(5000);
    await this.logoutConfirm().tap();
  },
};
