import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
export const CURRENT_OS = Platform.OS.toLowerCase();

export const ANDROID_VERSION =
  typeof Platform.Version === 'number'
    ? Platform.Version
    : parseInt(String(Platform.Version), 10);

export const ANDROID_API_LEVELS = {
  TIRAMISU: 33,
  UPSIDE_DOWN_CAKE: 34,
} as const;
