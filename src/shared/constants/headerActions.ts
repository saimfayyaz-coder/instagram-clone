import { TEST_IDS } from './testIds';

export const HEADER_ACTION_TYPES = {
  NOTIFICATIONS: 'notifications',
  MENU: 'menu',
  DIRECT: 'direct',
  CREATE: 'create',
  SETTINGS: 'settings',
  ADD: 'add',
} as const;

export type HeaderActionType =
  (typeof HEADER_ACTION_TYPES)[keyof typeof HEADER_ACTION_TYPES];

export interface HeaderActionConfig {
  iconType: 'Feather' | 'Ionicons';
  iconName: string;
  defaultSize: number;
  accessibilityLabel: string;
  testID: string;
}

export const HEADER_ACTION_CONFIGS: Record<HeaderActionType, HeaderActionConfig> = {
  [HEADER_ACTION_TYPES.NOTIFICATIONS]: {
    iconType: 'Feather',
    iconName: 'heart',
    defaultSize: 24,
    accessibilityLabel: 'Notifications',
    testID: TEST_IDS.HEADER.NOTIFICATIONS,
  },
  [HEADER_ACTION_TYPES.MENU]: {
    iconType: 'Feather',
    iconName: 'menu',
    defaultSize: 24,
    accessibilityLabel: 'Menu',
    testID: TEST_IDS.HEADER.MENU,
  },
  [HEADER_ACTION_TYPES.DIRECT]: {
    iconType: 'Ionicons',
    iconName: 'paper-plane-outline',
    defaultSize: 23,
    accessibilityLabel: 'Direct Messages',
    testID: TEST_IDS.HEADER.DIRECT,
  },
  [HEADER_ACTION_TYPES.CREATE]: {
    iconType: 'Feather',
    iconName: 'plus-square',
    defaultSize: 24,
    accessibilityLabel: 'Create post',
    testID: TEST_IDS.HEADER.CREATE,
  },
  [HEADER_ACTION_TYPES.SETTINGS]: {
    iconType: 'Feather',
    iconName: 'settings',
    defaultSize: 22,
    accessibilityLabel: 'Settings',
    testID: TEST_IDS.HEADER.SETTINGS,
  },
  [HEADER_ACTION_TYPES.ADD]: {
    iconType: 'Ionicons',
    iconName: 'add',
    defaultSize: 26,
    accessibilityLabel: 'Add',
    testID: 'header-action-add',
  },
};
