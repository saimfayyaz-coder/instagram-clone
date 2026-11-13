import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Touchable, Text, Icon, Loader, Header, Screen, Row } from '@/shared/ui';
import { useTheme, usePermission, useGalleryMedia } from '@/shared/hooks';
import { ms, commonStyles, layout } from '@/shared/theme';
import {
  APP_ICONS,
  TEST_IDS,
  MAIN_ROUTES,
  HEADER_BACK_ICON,
  GALLERY_CONFIG,
  PERMISSION_KINDS,
  TOAST_TYPES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { cropImage, resolveMediaRequest, takePhotoWithPermission } from '@/shared/lib/media';
import { showToast } from '@/shared/lib/toast';
import {
  CropViewport,
  CropViewportHandle,
  MediaGrid,
  AlbumSelectSheet,
  PermissionGuardView,
} from '@/features/media-picker';

type ProfilePhotoPickerRouteProp = RouteProp<
  MainStackParamList,
  typeof MAIN_ROUTES.PROFILE_PHOTO_PICKER
>;

export const ProfilePhotoPickerPage: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<ProfilePhotoPickerRouteProp>();
  const { requestId, crop } = params;
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [isProcessing, setIsProcessing] = useState(false);
  const cropViewportRef = useRef<CropViewportHandle>(null);
  const albumBottomSheetRef = useRef<BottomSheetModal>(null);

  const permission = usePermission(PERMISSION_KINDS.PHOTOS, { requestOnMount: true });

  const {
    photos,
    albums,
    selectedAlbum,
    selectedPhoto,
    setSelectedPhoto,
    selectAlbum,
    loadMorePhotos,
    isLoadingMore,
  } = useGalleryMedia(permission.isGranted);

  // Leaving without a photo (close button, back gesture) counts as cancel
  useEffect(() => () => resolveMediaRequest(requestId, null), [requestId]);

  const handleCancel = useCallback(() => navigation.goBack(), [navigation]);

  const handleOpenAlbums = useCallback(() => {
    albumBottomSheetRef.current?.present();
  }, []);

  const handleTakePhoto = useCallback(async () => {
    const photo = await takePhotoWithPermission();
    if (photo) {
      setSelectedPhoto(photo);
    }
  }, [setSelectedPhoto]);

  const handleDone = useCallback(async () => {
    const transform = cropViewportRef.current?.getTransform();
    if (!selectedPhoto || !transform || isProcessing) return;

    setIsProcessing(true);
    try {
      resolveMediaRequest(requestId, await cropImage(selectedPhoto, transform, crop));
      navigation.goBack();
    } catch {
      showToast({ message: t(TRANSLATION_KEYS.MEDIA_PICKER_CROP_FAILED), type: TOAST_TYPES.ERROR });
      setIsProcessing(false);
    }
  }, [selectedPhoto, isProcessing, requestId, crop, navigation, t]);

  const rightActions = useMemo(
    () => [
      {
        icon: isProcessing ? (
          <Loader size="small" />
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
        onPress: handleDone,
        accessibilityLabel: t(TRANSLATION_KEYS.COMMON_SAVE),
        testID: TEST_IDS.MEDIA_PICKER.HEADER_DONE,
      },
    ],
    [isProcessing, selectedPhoto, handleDone, theme.colors, t],
  );

  const albumLabel =
    selectedAlbum === GALLERY_CONFIG.RECENTS_ALBUM_TITLE
      ? t(TRANSLATION_KEYS.MEDIA_PICKER_RECENTS)
      : selectedAlbum;

  const renderBody = () => {
    if (permission.isChecking) {
      return null;
    }

    if (!permission.isGranted) {
      return (
        <View style={commonStyles.flex1}>
          <PermissionGuardView
            blocked={permission.isBlocked}
            onPress={permission.isBlocked ? permission.openSettings : permission.request}
          />
        </View>
      );
    }

    return (
      <View style={commonStyles.flex1}>
        <CropViewport
          ref={cropViewportRef}
          imageUri={selectedPhoto?.uri}
          imageWidth={selectedPhoto?.width}
          imageHeight={selectedPhoto?.height}
          aspect={crop.aspect}
          mask={crop.mask}
        />

        <Row
          justify="space-between"
          style={[
            styles.controlBar,
            {
              backgroundColor: theme.colors.bgPrimary,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <Touchable
            testID={TEST_IDS.MEDIA_PICKER.ALBUM_DROPDOWN_BUTTON}
            style={commonStyles.rowCenter}
            onPress={handleOpenAlbums}
            activeOpacity={0.7}
          >
            <Text
              variant="body"
              weight="bold"
              color={theme.colors.textPrimary}
              style={styles.albumText}
            >
              {albumLabel}
            </Text>
            <Icon
              type="Ionicons"
              name={APP_ICONS.CHEVRON_DOWN}
              size={ms(18)}
              color={theme.colors.textPrimary}
            />
          </Touchable>

          <Touchable
            testID={TEST_IDS.MEDIA_PICKER.CAMERA_BUTTON}
            style={[
              commonStyles.center,
              styles.cameraButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            <Icon
              type="Ionicons"
              name={APP_ICONS.CAMERA}
              size={ms(20)}
              color={theme.colors.textPrimary}
            />
          </Touchable>
        </Row>

        <View style={commonStyles.flex1}>
          <MediaGrid
            photos={photos}
            selectedPhotoId={selectedPhoto?.uri}
            onSelectPhoto={setSelectedPhoto}
            onLoadMorePhotos={loadMorePhotos}
            isLoadingMore={isLoadingMore}
          />
        </View>

        <AlbumSelectSheet
          bottomSheetRef={albumBottomSheetRef}
          albums={albums}
          selectedAlbum={selectedAlbum}
          onSelectAlbum={selectAlbum}
        />
      </View>
    );
  };

  return (
    <Screen
      header={
        <Header
          title={t(TRANSLATION_KEYS.MEDIA_PICKER_PROFILE_TITLE)}
          backIcon={HEADER_BACK_ICON.CLOSE}
          onBack={handleCancel}
          rightActions={rightActions}
          showBottomBorder
        />
      }
    >
      {renderBody()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  controlBar: {
    height: ms(44),
    paddingHorizontal: layout.gutter,
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
