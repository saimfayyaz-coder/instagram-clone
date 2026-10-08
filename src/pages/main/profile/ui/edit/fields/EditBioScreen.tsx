import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/atoms';
import { FormField } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import { selectCurrentUser, createBioSchema, BIO_MAX_LENGTH } from '@/entities/user';
import { useEditFieldSubmit } from '@/features/edit-profile';
import { SubScreenFormWidget } from '@/widgets/edit-profile';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface EditBioScreenProps {
  onBack?: () => void;
}

export const EditBioScreen: React.FC<EditBioScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const { submitField, isSaving, errorMessage, setErrorMessage } = useEditFieldSubmit();

  const bioSchema = useMemo(() => createBioSchema(t), [t]);

  const handleChangeText = useCallback(
    (text: string) => {
      setBio(text);
      if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, setErrorMessage],
  );

  const handleSave = useCallback(() => {
    const clean = bio.trim();
    const result = bioSchema.safeParse(clean);
    if (!result.success) {
      setErrorMessage(result.error.errors[0]?.message);
      return;
    }
    submitField({ bio: clean }, onBack);
  }, [bio, bioSchema, submitField, setErrorMessage, onBack]);

  const counterFooter = useMemo(
    () => (
      <View style={styles.counterRow}>
        <AppText
          variant="caption"
          color={
            bio.length >= BIO_MAX_LENGTH
              ? theme.colors.error
              : theme.colors.textSecondary
          }
        >
          {`${bio.length} / ${BIO_MAX_LENGTH}`}
        </AppText>
      </View>
    ),
    [bio.length, theme.colors.error, theme.colors.textSecondary],
  );

  return (
    <SubScreenFormWidget
      title={t(TRANSLATION_KEYS.PROFILE_BIO)}
      onSave={handleSave}
      isSaving={isSaving}
      extraFooter={counterFooter}
      onPressBack={onBack}
    >
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_BIO)}
        placeholder={t(TRANSLATION_KEYS.PROFILE_BIO_PLACEHOLDER)}
        value={bio}
        onChangeText={handleChangeText}
        maxLength={BIO_MAX_LENGTH}
        multiline
        autoFocus
        floating
        errorMessage={errorMessage}
      />
    </SubScreenFormWidget>
  );
};

const styles = StyleSheet.create({
  counterRow: {
    alignItems: 'flex-end',
    marginTop: ms(4),
    paddingHorizontal: ms(4),
  },
});
