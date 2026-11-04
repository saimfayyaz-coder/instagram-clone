import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Header, Screen } from '@/shared/ui';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { SettingsMenuWidget } from '@/widgets/settings';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Screen
      preset="scroll"
      header={<Header leftTitle={t(TRANSLATION_KEYS.SETTINGS_TITLE)} onBack={handleGoBack} />}
    >
      <SettingsMenuWidget />
    </Screen>
  );
};
