import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/atoms';
import { FormField } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks';
import {
  createLinkSchema,
  UserLink,
} from '@/entities/user';
import { useLinkSubmit } from '@/features/edit-profile';
import { BUTTON_VARIANTS } from '@/shared/constants';
import { SubScreenFormWidget } from '@/widgets/edit-profile';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface AddEditLinkScreenProps {
  onBack: () => void;
  editingLink?: UserLink | null;
}

export const AddEditLinkScreen: React.FC<AddEditLinkScreenProps> = ({
  onBack,
  editingLink,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [url, setUrl] = useState(editingLink?.url || '');
  const [title, setTitle] = useState(editingLink?.title || '');

  const {
    saveLink,
    removeLink,
    isSaving,
    isDeleting,
    errorMessage,
    setErrorMessage,
  } = useLinkSubmit();

  const isEditMode = Boolean(editingLink);
  const linkSchema = useMemo(() => createLinkSchema(t), [t]);

  const handleUrlChange = useCallback(
    (text: string) => {
      setUrl(text);
      if (errorMessage) {
        setErrorMessage(undefined);
      }
    },
    [errorMessage, setErrorMessage],
  );

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const handleSave = useCallback(async () => {
    const validationResult = linkSchema.safeParse({ url, title });
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      setErrorMessage(firstIssue?.message || t(TRANSLATION_KEYS.PROFILE_INVALID_URL));
      return;
    }

    await saveLink(
      {
        linkId: editingLink?._id,
        url: validationResult.data.url,
        title: validationResult.data.title || '',
      },
      onBack,
    );
  }, [
    url,
    title,
    linkSchema,
    editingLink,
    saveLink,
    onBack,
    setErrorMessage,
    t,
  ]);

  const handleDelete = useCallback(async () => {
    if (!editingLink) return;
    await removeLink(editingLink._id, onBack);
  }, [editingLink, removeLink, onBack]);

  const headerTitle = isEditMode
    ? t(TRANSLATION_KEYS.PROFILE_EDIT_LINK_TITLE)
    : t(TRANSLATION_KEYS.PROFILE_ADD_LINK_TITLE);

  return (
    <SubScreenFormWidget
      title={headerTitle}
      onSave={handleSave}
      isSaving={isSaving}
      onPressBack={onBack}
      extraFooter={
        isEditMode ? (
          <Button
            title={t(TRANSLATION_KEYS.PROFILE_DELETE_LINK)}
            variant={BUTTON_VARIANTS.GHOST}
            textColor={theme.colors.error}
            onPress={handleDelete}
            disabled={isSaving}
            loading={isDeleting}
            style={styles.removeButton}
          />
        ) : undefined
      }
    >
      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_LINK_URL_LABEL)}
        placeholder={t(TRANSLATION_KEYS.PROFILE_LINK_URL_PLACEHOLDER)}
        value={url}
        onChangeText={handleUrlChange}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        floating
        errorMessage={errorMessage}
      />

      <FormField
        label={t(TRANSLATION_KEYS.PROFILE_LINK_TITLE_LABEL)}
        placeholder={t(TRANSLATION_KEYS.PROFILE_LINK_TITLE_PLACEHOLDER)}
        value={title}
        onChangeText={handleTitleChange}
        autoCapitalize="sentences"
        floating
        maxLength={100}
      />
    </SubScreenFormWidget>
  );
};

const styles = StyleSheet.create({
  removeButton: {
    marginTop: ms(16),
    alignSelf: 'center',
  },
});
