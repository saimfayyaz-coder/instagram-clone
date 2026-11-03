import { I18nManager } from 'react-native';
import { RTL_LANGUAGES } from '@/shared/constants/i18n';

export const isRTLLanguage = (lang: string): boolean => {
  const baseCode = lang.toLowerCase().split('-')[0];
  return RTL_LANGUAGES.includes(baseCode);
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
