import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { AppModalBottomSheet } from '@/shared/components/molecules';
import { AppText, Icon, AppLoader } from '@/shared/components/atoms';
import { useTheme, useToast } from '@/shared/hooks';
import { useMediaPicker, PickedImage } from '@/shared/hooks/useMediaPicker';
import { ms } from '@/shared/theme';
import { APP_ICONS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { useUploadAvatarMutation, useDeleteAvatarMutation } from '@/entities/user';

export interface AvatarActionBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  hasAvatar: boolean;
  onSuccess?: () => void;
}

export const AvatarActionBottomSheet: React.FC<AvatarActionBottomSheetProps> = ({
  bottomSheetRef,
  hasAvatar,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { pickAvatarFromGallery, captureAvatarFromCamera } = useMediaPicker();
  const [isPicking, setIsPicking] = useState(false);

  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation();

  const isBusy = isPicking || isUploading || isDeleting;

  const handleDismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  const handleUploadImage = useCallback(
    async (image: PickedImage) => {
      try {
        const formData = new FormData();
        const fileUri =
          Platform.OS === 'android' ? image.uri : image.uri.replace('file://', '');

        formData.append('avatar', {
          uri: fileUri,
          name: image.fileName || `avatar-${Date.now()}.jpg`,
          type: image.type || 'image/jpeg',
        } as any);

        await uploadAvatar(formData).unwrap();
        // Instagram-style: no success toast, sheet closes smoothly
        handleDismiss();
        onSuccess?.();
      } catch (err: any) {
        showToast({
          message: err?.data?.message || 'Failed to update profile picture',
          type: 'error',
        });
      }
    },
    [uploadAvatar, showToast, handleDismiss, onSuccess],
  );

  const handleTakePhoto = useCallback(async () => {
    try {
      setIsPicking(true);
      const image = await captureAvatarFromCamera();
      if (image) {
        await handleUploadImage(image);
      }
    } finally {
      setIsPicking(false);
    }
  }, [captureAvatarFromCamera, handleUploadImage]);

  const handleChooseFromLibrary = useCallback(async () => {
    try {
      setIsPicking(true);
      const image = await pickAvatarFromGallery();
      if (image) {
        await handleUploadImage(image);
      }
    } finally {
      setIsPicking(false);
    }
  }, [pickAvatarFromGallery, handleUploadImage]);

  const handleRemoveAvatar = useCallback(async () => {
    try {
      await deleteAvatar().unwrap();
      // Instagram-style: no success toast, sheet closes smoothly
      handleDismiss();
      onSuccess?.();
    } catch (err: any) {
      showToast({
        message: err?.data?.message || 'Failed to remove profile picture',
        type: 'error',
      });
    }
  }, [deleteAvatar, showToast, handleDismiss, onSuccess]);

  return (
    <AppModalBottomSheet
      ref={bottomSheetRef as any}
      enableDynamicSizing
      enablePanDownToClose={!isBusy}
    >
      <BottomSheetView style={styles.sheetContainer}>
        {/* Title bar */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <AppText variant="body" weight="bold" color={theme.colors.textPrimary}>
            {t(TRANSLATION_KEYS.PROFILE_EDIT_PICTURE)}
          </AppText>
        </View>

        {isBusy ? (
          <View style={styles.loaderContainer}>
            <AppLoader size="small" />
          </View>
        ) : (
          <View style={styles.optionsList}>
            {/* Take Photo */}
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

            {/* Choose from Library */}
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

            {/* Remove Current Picture (destructive) */}
            {hasAvatar && (
              <TouchableOpacity
                style={styles.optionRow}
                onPress={handleRemoveAvatar}
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
        )}
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
  loaderContainer: {
    paddingVertical: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
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
