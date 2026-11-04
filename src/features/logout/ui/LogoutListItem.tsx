import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem } from '@/shared/ui';
import { useAlert } from '@/shared/hooks';
import { ALERT_BUTTON_STYLES, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { useLogout } from '../hooks/useLogout';

// "Log out" row that asks for confirmation before ending the session
export const LogoutListItem: React.FC = () => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const { logout, isLoading } = useLogout();

  const handlePress = useCallback(() => {
    showAlert({
      title: t(TRANSLATION_KEYS.SETTINGS_LOGOUT_CONFIRM_TITLE),
      message: t(TRANSLATION_KEYS.SETTINGS_LOGOUT_CONFIRM_MESSAGE),
      buttons: [
        { text: t(TRANSLATION_KEYS.COMMON_CANCEL), style: ALERT_BUTTON_STYLES.CANCEL },
        { text: t(TRANSLATION_KEYS.SETTINGS_LOGOUT), style: ALERT_BUTTON_STYLES.DESTRUCTIVE, onPress: logout },
      ],
    });
  }, [showAlert, logout, t]);

  return (
    <ListItem
      title={t(TRANSLATION_KEYS.SETTINGS_LOGOUT)}
      onPress={isLoading ? undefined : handlePress}
      destructive
      testID={TEST_IDS.SETTINGS.LOGOUT}
    />
  );
};
