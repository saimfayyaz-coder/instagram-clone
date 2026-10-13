import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppModalBottomSheet } from '@/shared/components/molecules';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { useMediaPicker } from '@/shared/hooks/useMediaPicker';
import { PickedImage, MainStackParamList } from '@/shared/types';
import { ms } from '@/shared/theme';
import { APP_ICONS, MAIN_ROUTES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface AvatarActionBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  hasAvatar: boolean;
  onSelectImage: (image: PickedImage) => void;
  onRemoveAvatar: () => void;
}

export const AvatarActionBottomSheet: React.FC<AvatarActionBottomSheetProps> = ({
  bottomSheetRef,
  hasAvatar,
  onSelectImage,
  onRemoveAvatar,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { captureAvatarFromCamera } = useMediaPicker();

  const handleDismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  const handleTakePhoto = useCallback(async () => {
    const image = await captureAvatarFromCamera();
    if (image) {
      handleDismiss();
      onSelectImage(image);
    }
  }, [captureAvatarFromCamera, handleDismiss, onSelectImage]);

  const handleChooseFromLibrary = useCallback(() => {
    handleDismiss();
    navigation.navigate(MAIN_ROUTES.PROFILE_PHOTO_PICKER, {
      onSelectImage,
    });
  }, [navigation, handleDismiss, onSelectImage]);

  const handleRemove = useCallback(() => {
    handleDismiss();
    onRemoveAvatar();
  }, [handleDismiss, onRemoveAvatar]);

  return (
    <AppModalBottomSheet
      ref={bottomSheetRef as any}
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView style={styles.sheetContainer}>
        {/* Title bar */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <AppText variant="body" weight="bold" color={theme.colors.textPrimary}>
            {t(TRANSLATION_KEYS.PROFILE_EDIT_PICTURE)}
          </AppText>
        </View>

        <View style={styles.optionsList}>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Icon
                type="Ionicons"
                name={APP_ICONS.CAMERA}
                size={24}
                color={theme.colors.textPrimary}
              />
            </View>
            <AppText variant="body" color={theme.colors.textPrimary} style={styles.optionText}>
              {t(TRANSLATION_KEYS.PROFILE_TAKE_PHOTO)}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={handleChooseFromLibrary}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Icon
                type="Ionicons"
                name={APP_ICONS.IMAGES}
                size={24}
                color={theme.colors.textPrimary}
              />
            </View>
            <AppText variant="body" color={theme.colors.textPrimary} style={styles.optionText}>
              {t(TRANSLATION_KEYS.PROFILE_CHOOSE_LIBRARY)}
            </AppText>
          </TouchableOpacity>

          {hasAvatar && (
            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleRemove}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  type="Ionicons"
                  name={APP_ICONS.TRASH}
                  size={24}
                  color={theme.colors.error}
                />
              </View>
              <AppText
                variant="body"
                color={theme.colors.error}
                style={styles.optionText}
              >
                {t(TRANSLATION_KEYS.PROFILE_REMOVE_PICTURE)}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheetView>
    </AppModalBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingHorizontal: ms(20),
    paddingBottom: ms(32),
  },
  header: {
    paddingVertical: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: ms(8),
  },
  optionsList: {
    paddingTop: ms(8),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(14),
  },
  iconWrapper: {
    width: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ms(12),
  },
  optionText: {
    fontSize: ms(15),
  },
});
