import React, { useCallback, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ListItem, ListSection } from '@/shared/ui';
import { APP_ICONS, MAIN_ROUTES, TEST_IDS } from '@/shared/constants';
import { MainStackParamList } from '@/shared/types';
import { AVAILABLE_LANGUAGES } from '@/shared/lib/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ThemeSelectSheet, useThemeModeLabel } from '@/features/theme-select';
import { LanguageSelectSheet } from '@/features/language-select';
import { LogoutListItem } from '@/features/logout';

export const SettingsMenuWidget: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const themeSheetRef = useRef<BottomSheetModal>(null);
  const languageSheetRef = useRef<BottomSheetModal>(null);

  const themeLabel = useThemeModeLabel();
  const baseLanguage = i18n.language.split('-')[0];
  const languageLabel =
    AVAILABLE_LANGUAGES.find((lang) => lang.code === baseLanguage)?.nativeName ?? '';

  const handleEditProfile = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.EDIT_PROFILE);
  }, [navigation]);

  const handleOpenTheme = useCallback(() => {
    themeSheetRef.current?.present();
  }, []);

  const handleOpenLanguage = useCallback(() => {
    languageSheetRef.current?.present();
  }, []);

  return (
    <>
      <ListSection title={t(TRANSLATION_KEYS.SETTINGS_SECTION_ACCOUNT)}>
        <ListItem
          icon={APP_ICONS.PERSON_CIRCLE}
          title={t(TRANSLATION_KEYS.PROFILE_EDIT_PROFILE)}
          onPress={handleEditProfile}
          chevron
          testID={TEST_IDS.SETTINGS.EDIT_PROFILE}
        />
      </ListSection>

      <ListSection title={t(TRANSLATION_KEYS.SETTINGS_SECTION_APP)}>
        <ListItem
          icon={APP_ICONS.CONTRAST}
          title={t(TRANSLATION_KEYS.SETTINGS_THEME)}
          value={themeLabel}
          onPress={handleOpenTheme}
          chevron
          testID={TEST_IDS.SETTINGS.THEME}
        />
        <ListItem
          icon={APP_ICONS.LANGUAGE}
          title={t(TRANSLATION_KEYS.SETTINGS_LANGUAGE)}
          value={languageLabel}
          onPress={handleOpenLanguage}
          chevron
          testID={TEST_IDS.SETTINGS.LANGUAGE}
        />
      </ListSection>

      <ListSection title={t(TRANSLATION_KEYS.SETTINGS_SECTION_LOGIN)} last>
        <LogoutListItem />
      </ListSection>

      <ThemeSelectSheet ref={themeSheetRef} />
      <LanguageSelectSheet ref={languageSheetRef} />
    </>
  );
};
