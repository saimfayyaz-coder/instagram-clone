import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const CURRENT_OS = Platform.OS.toLowerCase();
export const isIOS = Platform.OS === 'ios';
