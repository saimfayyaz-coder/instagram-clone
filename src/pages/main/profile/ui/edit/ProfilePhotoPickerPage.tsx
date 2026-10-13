import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import { AppText, Icon, AppLoader } from '@/shared/components/atoms';
import { AppHeader } from '@/shared/components/organisms';
import { ScreenWrapper } from '@/shared/components/layout';
import { useTheme } from '@/shared/hooks';
import { ms, commonStyles } from '@/shared/theme';
import {
  APP_ICONS,
  TEST_IDS,
  MAIN_ROUTES,
  HEADER_LEFT_ICON_TYPE,
  MEDIA_PICKER_ERROR_CODE,
  GALLERY_CONFIG,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import {
  useMediaPermission,
  useGalleryMedia,
  GalleryPhotoItem,
} from '@/shared/hooks';
import { cropImageToSquare } from '@/shared/lib/media';
import {
  CropViewport,
  CropViewportHandle,
  MediaGrid,
  AlbumSelectBottomSheet,
  PermissionGuardView,
} from '@/features/media-picker';

type ProfilePhotoPickerRouteProp = RouteProp<
  MainStackParamList,
  typeof MAIN_ROUTES.PROFILE_PHOTO_PICKER
>;

export const ProfilePhotoPickerPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ProfilePhotoPickerRouteProp>();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [isProcessing, setIsProcessing] = useState(false);

  const cropViewportRef = useRef<CropViewportHandle>(null);
  const albumBottomSheetRef = useRef<BottomSheetModal>(null);

  const { isGranted, requestPermission } = useMediaPermission();

  const {
    photos,
    albums,
    selectedAlbum,
    selectedPhoto,
    setSelectedPhoto,
    selectAlbum,
    loadMorePhotos,
    isLoadingMore,
  } = useGalleryMedia(isGranted);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenAlbums = useCallback(() => {
    albumBottomSheetRef.current?.present();
  }, []);

  const handleSnapPhoto = useCallback(async () => {
    try {
      const captured = await ImagePicker.openCamera({
        cropping: false,
        mediaType: 'photo',
        compressImageQuality: 0.9,
      });

      if (captured && captured.path) {
        const snappedPhoto: GalleryPhotoItem = {
          id: captured.path,
          uri: captured.path,
          width: captured.width || GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
          height: captured.height || GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
          filename: captured.filename || `camera_${Date.now()}.jpg`,
          fileSize: captured.size || 0,
        };
        setSelectedPhoto(snappedPhoto);
      }
    } catch (err: any) {
      if (err?.code !== MEDIA_PICKER_ERROR_CODE.CANCELLED) {
        console.warn('Camera error:', err);
      }
    }
  }, [setSelectedPhoto]);

  const handleDone = useCallback(async () => {
    if (!selectedPhoto || isProcessing) return;

    setIsProcessing(true);
    try {
      const transforms = cropViewportRef.current?.getTransforms();

      const scale = transforms?.scale ?? 1;
      const translateX = transforms?.translateX ?? 0;
      const translateY = transforms?.translateY ?? 0;
      const viewportSize = transforms?.viewportSize ?? 375;

      const croppedImage = await cropImageToSquare({
        imageUri: selectedPhoto.uri,
        originalWidth: selectedPhoto.width,
        originalHeight: selectedPhoto.height,
        viewportSize,
        scale,
        translateX,
        translateY,
        targetSize: GALLERY_CONFIG.DEFAULT_TARGET_SIZE,
      });

      if (route.params?.onSelectImage) {
        route.params.onSelectImage(croppedImage);
      }

      navigation.goBack();
    } catch (err) {
      console.error('Failed to crop and finalize image:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPhoto, isProcessing, route.params, navigation]);

  const rightActions = useMemo(
    () => [
      {
        icon: isProcessing ? (
          <AppLoader size="small" />
        ) : (
          <Icon
            type="Ionicons"
            name={APP_ICONS.CHECKMARK}
            size={24}
            color={
              selectedPhoto
                ? theme.colors.actionPrimary
                : theme.colors.actionPrimaryDisabled
            }
          />
        ),
        onPress: selectedPhoto && !isProcessing ? handleDone : () => {},
        accessibilityLabel: t(TRANSLATION_KEYS.COMMON_SAVE),
        testID: TEST_IDS.MEDIA_PICKER.HEADER_DONE,
      },
    ],
    [isProcessing, selectedPhoto, handleDone, theme.colors, t],
  );

  return (
    <ScreenWrapper
      header={
        <AppHeader
          title={t(TRANSLATION_KEYS.MEDIA_PICKER_PROFILE_TITLE)}
          leftIconType={HEADER_LEFT_ICON_TYPE.CLOSE}
          onPressLeft={handleCancel}
          rightActions={rightActions}
          showBottomBorder
        />
      }
    >
      {!isGranted ? (
        <View style={commonStyles.flex1}>
          <PermissionGuardView onPressTurnOn={requestPermission} />
          <View style={commonStyles.flex1} />
        </View>
      ) : (
        <View style={commonStyles.flex1}>
          {/* Top: Interactive Cropper Viewport */}
          <CropViewport
            ref={cropViewportRef}
            imageUri={selectedPhoto?.uri}
            imageWidth={selectedPhoto?.width}
            imageHeight={selectedPhoto?.height}
            maskShape="circle"
          />

          {/* Middle: Control Bar */}
          <View
            style={[
              commonStyles.rowBetween,
              styles.controlBar,
              {
                backgroundColor: theme.colors.bgPrimary,
                borderBottomColor: theme.colors.border,
              },
            ]}
          >
            <TouchableOpacity
              testID={TEST_IDS.MEDIA_PICKER.ALBUM_DROPDOWN_BUTTON}
              style={commonStyles.rowCenter}
              onPress={handleOpenAlbums}
              activeOpacity={0.7}
            >
              <AppText
                variant="body"
                weight="bold"
                color={theme.colors.textPrimary}
                style={styles.albumText}
              >
                {selectedAlbum}
              </AppText>
              <Icon
                type="Ionicons"
                name={APP_ICONS.CHEVRON_DOWN}
                size={ms(18)}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                commonStyles.center,
                styles.cameraButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={handleSnapPhoto}
              activeOpacity={0.7}
            >
              <Icon
                type="Ionicons"
                name={APP_ICONS.CAMERA}
                size={ms(20)}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom: Gallery Photos Grid */}
          <View style={commonStyles.flex1}>
            <MediaGrid
              photos={photos}
              selectedPhotoId={selectedPhoto?.id}
              onSelectPhoto={setSelectedPhoto}
              onLoadMorePhotos={loadMorePhotos}
              isLoadingMore={isLoadingMore}
            />
          </View>

          {/* Albums Bottom Sheet */}
          <AlbumSelectBottomSheet
            bottomSheetRef={albumBottomSheetRef}
            albums={albums}
            selectedAlbum={selectedAlbum}
            onSelectAlbum={selectAlbum}
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  controlBar: {
    height: ms(44),
    paddingHorizontal: ms(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  albumText: {
    marginRight: ms(4),
  },
  cameraButton: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
  },
});
