import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Sheet, SheetContent, SheetHeader, ListItem } from '@/shared/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useCaptureMedia } from '@/shared/hooks';
import { MediaAsset } from '@/shared/types';
import { ms } from '@/shared/theme';
import { APP_ICONS, CROP_PRESETS, MEDIA_SOURCES, MediaSource } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface AvatarActionSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  hasAvatar: boolean;
  onSelectImage: (image: MediaAsset) => void;
  onRemoveAvatar: () => void;
}

export const AvatarActionSheet: React.FC<AvatarActionSheetProps> = ({
  bottomSheetRef,
  hasAvatar,
  onSelectImage,
  onRemoveAvatar,
}) => {
  const { t } = useTranslation();
  const captureMedia = useCaptureMedia();

  const handleDismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  const capture = useCallback(
    async (source: MediaSource) => {
      handleDismiss();
      const image = await captureMedia({ source, crop: CROP_PRESETS.AVATAR });
      if (image) {
        onSelectImage(image);
      }
    },
    [captureMedia, handleDismiss, onSelectImage],
  );

  const handleTakePhoto = useCallback(() => capture(MEDIA_SOURCES.CAMERA), [capture]);

  const handleChooseFromLibrary = useCallback(() => capture(MEDIA_SOURCES.LIBRARY), [capture]);

  const handleRemove = useCallback(() => {
    handleDismiss();
    onRemoveAvatar();
  }, [handleDismiss, onRemoveAvatar]);

  return (
    <Sheet
      ref={bottomSheetRef as any}
      enableDynamicSizing
      enablePanDownToClose
    >
      <SheetContent style={styles.sheetContainer}>
        <SheetHeader title={t(TRANSLATION_KEYS.PROFILE_EDIT_PICTURE)} />

        <ListItem
          icon={APP_ICONS.CAMERA}
          title={t(TRANSLATION_KEYS.PROFILE_TAKE_PHOTO)}
          onPress={handleTakePhoto}
        />
        <ListItem
          icon={APP_ICONS.IMAGES}
          title={t(TRANSLATION_KEYS.PROFILE_CHOOSE_LIBRARY)}
          onPress={handleChooseFromLibrary}
        />
        {hasAvatar && (
          <ListItem
            icon={APP_ICONS.TRASH}
            title={t(TRANSLATION_KEYS.PROFILE_REMOVE_PICTURE)}
            onPress={handleRemove}
            destructive
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingBottom: ms(32),
  },
});
