import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/atoms';
import { LoadingHudOverlay } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import { selectCurrentUser, UserAvatar } from '@/entities/user';
import { useAvatarEdit } from '../model/useAvatarEdit';
import { AvatarActionBottomSheet } from './AvatarActionBottomSheet';
import { ACCESSIBILITY_ROLES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export const AvatarEditSection: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const avatarSheetRef = useRef<BottomSheetModal | null>(null);

  const { handleSelectImage, handleRemoveAvatar, showLoadingHud } = useAvatarEdit();

  const handleOpenSheet = useCallback(() => {
    avatarSheetRef.current?.present();
  }, []);

  const hasAvatar = Boolean(currentUser?.avatar?.url || currentUser?.avatarUrl);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleOpenSheet}
        activeOpacity={0.8}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        accessibilityLabel={t(TRANSLATION_KEYS.PROFILE_EDIT_PICTURE)}
      >
        <UserAvatar user={currentUser} size={96} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleOpenSheet}
        activeOpacity={0.7}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        style={styles.editButton}
      >
        <AppText
          variant="body"
          weight="bold"
          color={theme.colors.actionPrimary}
          style={styles.editText}
        >
          {t(TRANSLATION_KEYS.PROFILE_EDIT_PICTURE)}
        </AppText>
      </TouchableOpacity>

      <AvatarActionBottomSheet
        bottomSheetRef={avatarSheetRef}
        hasAvatar={hasAvatar}
        onSelectImage={handleSelectImage}
        onRemoveAvatar={handleRemoveAvatar}
      />

      <LoadingHudOverlay visible={showLoadingHud} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: ms(20),
    paddingBottom: ms(16),
  },
  editButton: {
    marginTop: ms(10),
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
  },
  editText: {
    fontSize: ms(13),
  },
});
