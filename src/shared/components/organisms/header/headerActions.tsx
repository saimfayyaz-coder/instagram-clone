import { Icon } from '@/shared/components/atoms';
import { HeaderActionItem } from './AppHeader';
import {
  HEADER_ACTION_TYPES,
  HEADER_ACTION_CONFIGS,
  type HeaderActionType,
} from '@/shared/constants';

export interface HeaderActionOptions {
  badgeCount?: number;
  badgeDot?: boolean;
  testID?: string;
  color?: string;
  size?: number;
  accessibilityLabel?: string;
}

export const createHeaderAction = (
  type: HeaderActionType,
  onPress: () => void,
  options: HeaderActionOptions = {},
): HeaderActionItem => {
  const config = HEADER_ACTION_CONFIGS[type];
  return {
    icon: (
      <Icon
        type={config.iconType}
        name={config.iconName}
        size={options.size ?? config.defaultSize}
        color={options.color}
      />
    ),
    onPress,
    accessibilityLabel: options.accessibilityLabel || config.accessibilityLabel,
    badgeCount: options.badgeCount,
    badgeDot: options.badgeDot,
    testID: options.testID || config.testID,
  };
};

export const headerActions = {
  notifications: (onPress: () => void, options?: HeaderActionOptions) =>
    createHeaderAction(HEADER_ACTION_TYPES.NOTIFICATIONS, onPress, options),

  menu: (onPress: () => void, options?: HeaderActionOptions) =>
    createHeaderAction(HEADER_ACTION_TYPES.MENU, onPress, options),

  direct: (onPress: () => void, options?: HeaderActionOptions) =>
    createHeaderAction(HEADER_ACTION_TYPES.DIRECT, onPress, options),

  create: (onPress: () => void, options?: HeaderActionOptions) =>
    createHeaderAction(HEADER_ACTION_TYPES.CREATE, onPress, options),

  settings: (onPress: () => void, options?: HeaderActionOptions) =>
    createHeaderAction(HEADER_ACTION_TYPES.SETTINGS, onPress, options),

  custom: createHeaderAction,
};
