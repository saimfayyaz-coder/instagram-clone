import { useTranslation } from 'react-i18next';
import { THEME_MODES, ThemeMode } from '@/shared/constants';
import { useTheme } from '@/shared/hooks';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export const THEME_MODE_OPTIONS: { mode: ThemeMode; labelKey: TRANSLATION_KEYS }[] = [
  { mode: THEME_MODES.SYSTEM, labelKey: TRANSLATION_KEYS.SETTINGS_SYSTEM },
  { mode: THEME_MODES.LIGHT, labelKey: TRANSLATION_KEYS.SETTINGS_LIGHT },
  { mode: THEME_MODES.DARK, labelKey: TRANSLATION_KEYS.SETTINGS_DARK },
];

// Translated name of the theme mode currently in use
export const useThemeModeLabel = (): string => {
  const { t } = useTranslation();
  const { mode } = useTheme();
  const option = THEME_MODE_OPTIONS.find((item) => item.mode === mode);
  return option ? t(option.labelKey) : '';
};
