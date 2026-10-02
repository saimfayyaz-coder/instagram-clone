import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/shared/components/molecules';
import { useAppSelector } from '@/app/store/hooks';
import { selectCurrentUser, createNameSchema, NAME_MAX_LENGTH } from '@/entities/user';
import { useEditFieldSubmit } from '@/features/edit-profile';
import { SubScreenFormWidget } from '@/widgets/edit-profile';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface EditNameScreenProps {
  onBack?: () => void;
}

export const EditNameScreen: React.FC<EditNameScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const currentUser = useAppSelector(selectCurrentUser);
  const [name, setName] = useState(currentUser?.name || currentUser?.fullName || '');
  const { submitField, isSaving, errorMessage, setErrorMessage } = useEditFieldSubmit();

  const nameSchema = useMemo(() => createNameSchema(t), [t]);

  const handleChangeText = useCallback(
    (text: string) => {
      setName(text);
      if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, setErrorMessage],
  );

  const handleSave = useCallback(() => {
    const clean = name.trim();
    const result = nameSchema.safeParse(clean);
    if (!result.success) {
      setErrorMessage(result.error.errors[0]?.message);
      return;
    }
    submitField({ name: clean }, onBack);
  }, [name, nameSchema, submitField, setErrorMessage, onBack]);

  return (
    <SubScreenFormWidget
      title={t(TRANSLATION_KEYS.PROFILE_NAME)}
      onSave={handleSave}
      isSaving={isSaving}
      subtitle={t(TRANSLATION_KEYS.PROFILE_NAME_SUBTITLE)}
      onPressBack={onBack}
    >
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_NAME)}
        placeholder={t(TRANSLATION_KEYS.PROFILE_NAME_PLACEHOLDER)}
        value={name}
        onChangeText={handleChangeText}
        maxLength={NAME_MAX_LENGTH}
        autoFocus
        floating
        errorMessage={errorMessage}
      />
    </SubScreenFormWidget>
  );
};
