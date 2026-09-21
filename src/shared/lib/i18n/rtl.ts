import { I18nManager } from 'react-native';

export const isRTLLanguage = (lang: string): boolean => {
  return lang.toLowerCase() === 'ur' || lang.toLowerCase().startsWith('ur-');
};

export const applyRTLIfNeeded = (lang: string): boolean => {
  const shouldBeRTL = isRTLLanguage(lang);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    return true;
  }
  return false;
};
