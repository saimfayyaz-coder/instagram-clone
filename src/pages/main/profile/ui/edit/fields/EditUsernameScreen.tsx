import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, AppLoader } from '@/shared/components/atoms';
import { FormField } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import {
  selectCurrentUser,
  useUsernameAvailability,
  USERNAME_MAX_LENGTH,
} from '@/entities/user';
import { useEditFieldSubmit } from '@/features/edit-profile';
import { SubScreenFormWidget } from '@/widgets/edit-profile';
import { APP_ICONS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface EditUsernameScreenProps {
  onBack?: () => void;
}

export const EditUsernameScreen: React.FC<EditUsernameScreenProps> = ({
  onBack,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUsername = currentUser?.username || '';
  const [username, setUsername] = useState(currentUsername);

  const {
    isAvailable,
    isChecking,
    availabilityError,
    checkAvailability,
    verifyImmediate,
  } = useUsernameAvailability({ currentUsername });

  const { submitField, isSaving, errorMessage, setErrorMessage } =
    useEditFieldSubmit();

  const handleTextChange = useCallback(
    (text: string) => {
      const clean = text.toLowerCase().trim();
      setUsername(clean);
      setErrorMessage(undefined);
      checkAvailability(clean);
    },
    [checkAvailability, setErrorMessage],
  );

  const handleSave = useCallback(async () => {
    const clean = username.trim().toLowerCase();
    if (clean === currentUsername.toLowerCase()) {
      if (onBack) {
        onBack();
      }
      return;
    }

    const isValid = await verifyImmediate(clean);
    if (!isValid) return;

    submitField({ username: clean }, onBack);
  }, [username, currentUsername, verifyImmediate, submitField, onBack]);

  const activeError = errorMessage || availabilityError;

  const rightElement = useMemo(() => {
    if (isChecking) {
      return <AppLoader size="small" />;
    }
    if (username && username !== currentUsername) {
      if (isAvailable === true && !activeError) {
        return (
          <Icon
            type="Ionicons"
            name={APP_ICONS.CHECKMARK_CIRCLE}
            size={20}
            color={theme.colors.success}
          />
        );
      }
      if (isAvailable === false || activeError) {
        return (
          <Icon
            type="Ionicons"
            name={APP_ICONS.CLOSE_CIRCLE}
            size={20}
            color={theme.colors.error}
          />
        );
      }
    }
    return null;
  }, [isChecking, username, currentUsername, isAvailable, activeError, theme.colors.success, theme.colors.error]);

  return (
    <SubScreenFormWidget
      title={t(TRANSLATION_KEYS.PROFILE_USERNAME)}
      onSave={handleSave}
      isSaving={isSaving}
      subtitle={t(TRANSLATION_KEYS.PROFILE_USERNAME_SUBTITLE)}
      onPressBack={onBack}
    >
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_USERNAME)}
        value={username}
        onChangeText={handleTextChange}
        maxLength={USERNAME_MAX_LENGTH}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        floating
        errorMessage={activeError || undefined}
        rightElement={rightElement}
      />
    </SubScreenFormWidget>
  );
};
