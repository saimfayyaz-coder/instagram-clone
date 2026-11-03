import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Sheet, SheetContent, SheetHeader, ListItem } from '@/shared/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMediaPicker } from '@/shared/hooks/useMediaPicker';
import { PickedImage, MainStackParamList } from '@/shared/types';
import { ms } from '@/shared/theme';
import { APP_ICONS, MAIN_ROUTES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface AvatarActionSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  hasAvatar: boolean;
  onSelectImage: (image: PickedImage) => void;
  onRemoveAvatar: () => void;
}

export const AvatarActionSheet: React.FC<AvatarActionSheetProps> = ({
  bottomSheetRef,
  hasAvatar,
  onSelectImage,
  onRemoveAvatar,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
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
