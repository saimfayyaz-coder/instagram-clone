import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/shared/components/molecules';
import { useAppSelector } from '@/app/store/hooks';
import { selectCurrentUser, createWebsiteSchema } from '@/entities/user';
import { useEditFieldSubmit } from '@/features/edit-profile';
import { SubScreenFormWidget } from '@/widgets/edit-profile';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface EditLinksScreenProps {
  onBack?: () => void;
}

export const EditLinksScreen: React.FC<EditLinksScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const currentUser = useAppSelector(selectCurrentUser);
  const [website, setWebsite] = useState(currentUser?.website || '');
  const { submitField, isSaving, errorMessage, setErrorMessage } = useEditFieldSubmit();

  const websiteSchema = useMemo(() => createWebsiteSchema(t), [t]);

  const handleChangeText = useCallback(
    (text: string) => {
      setWebsite(text);
      if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, setErrorMessage],
  );

  const handleSave = useCallback(() => {
    const result = websiteSchema.safeParse(website);
    if (!result.success) {
      setErrorMessage(result.error.errors[0]?.message);
      return;
    }

    submitField({ website: result.data || '' }, onBack);
  }, [website, websiteSchema, submitField, setErrorMessage, onBack]);

  return (
    <SubScreenFormWidget
      title={t(TRANSLATION_KEYS.PROFILE_LINKS)}
      onSave={handleSave}
      isSaving={isSaving}
      onPressBack={onBack}
    >
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_WEBSITE_LABEL)}
        placeholder={t(TRANSLATION_KEYS.PROFILE_LINKS_PLACEHOLDER)}
        value={website}
        onChangeText={handleChangeText}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        floating
        errorMessage={errorMessage}
      />
    </SubScreenFormWidget>
  );
};
