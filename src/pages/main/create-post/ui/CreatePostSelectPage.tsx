import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Header, Icon, Screen, Text, Touchable } from '@/shared/ui';
import { useGalleryMedia, usePermission, useTheme } from '@/shared/hooks';
import { commonStyles, iconSize, sizes, spacing } from '@/shared/theme';
import {
  ACCESSIBILITY_ROLES,
  APP_ICONS,
  GALLERY_CONFIG,
  HEADER_BACK_ICON,
  MAIN_ROUTES,
  MASK_SHAPES,
  PERMISSION_KINDS,
  TEST_IDS,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { takePhotoWithPermission } from '@/shared/lib/media';
import { useAppDispatch } from '@/app/store/hooks';
import {
  AlbumSelectSheet,
  CropViewport,
  MediaGrid,
  MediaPickerControlBar,
  PermissionGuardView,
} from '@/features/media-picker';
import {
  createClientRequestId,
  postDraftCropFailed,
  postDraftCropped,
  postDraftStarted,
  usePostMediaSelection,
} from '@/features/create-post';

export const CreatePostSelectPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const albumSheetRef = useRef<BottomSheetModal>(null);

  const permission = usePermission(PERMISSION_KINDS.PHOTOS, { requestOnMount: true });
  const { photos, albums, selectedAlbum, selectAlbum, loadMorePhotos, isLoadingMore } =
    useGalleryMedia(permission.isGranted);

  const {
    viewportRef,
    selected,
    selectionOrder,
    preview,
    previewFraming,
    isMultiSelect,
    aspectRatio,
    selectPhoto,
    toggleMultiSelect,
    cycleAspectRatio,
    cropSelected,
  } = usePostMediaSelection(photos[0]);

  const hasSelection = selected.length > 0;

  const handleClose = useCallback(() => navigation.goBack(), [navigation]);
  const handleOpenAlbums = useCallback(() => albumSheetRef.current?.present(), []);

  const handleTakePhoto = useCallback(async () => {
    const photo = await takePhotoWithPermission();
    if (photo) {
      selectPhoto(photo);
    }
  }, [selectPhoto]);

  // Opens the caption screen at once; the photos keep cropping in the background
  const handleNext = useCallback(() => {
    if (!hasSelection) return;

    const id = createClientRequestId();
    dispatch(postDraftStarted({ id, aspectRatio, imageCount: selected.length }));
    cropSelected()
      .then(images =>
        dispatch(
          images.length > 0 ? postDraftCropped({ id, images }) : postDraftCropFailed({ id }),
        ),
      )
      .catch(() => dispatch(postDraftCropFailed({ id })));
    navigation.navigate(MAIN_ROUTES.CREATE_POST_DETAILS);
  }, [aspectRatio, cropSelected, dispatch, hasSelection, navigation, selected.length]);

  const headerRight = useMemo(
    () => (
      <Touchable
        onPress={handleNext}
        disabled={!hasSelection}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        testID={TEST_IDS.CREATE_POST.NEXT}
      >
        <Text
          weight="semibold"
          color={hasSelection ? theme.colors.actionPrimary : theme.colors.actionPrimaryDisabled}
        >
          {t(TRANSLATION_KEYS.CREATE_POST_NEXT)}
        </Text>
      </Touchable>
    ),
    [handleNext, hasSelection, t, theme.colors],
  );

  const multiSelectButton = (
    <Touchable
      onPress={toggleMultiSelect}
      activeOpacity={0.7}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={t(TRANSLATION_KEYS.CREATE_POST_SELECT_MULTIPLE)}
      accessibilityState={{ selected: isMultiSelect }}
      testID={TEST_IDS.CREATE_POST.MULTI_SELECT}
      style={[
        commonStyles.center,
        styles.roundButton,
        { backgroundColor: isMultiSelect ? theme.colors.actionPrimary : theme.colors.surface },
      ]}
    >
      <Icon
        type="Ionicons"
        name={APP_ICONS.MULTI_SELECT}
        size={iconSize.sm}
        color={isMultiSelect ? theme.colors.onPrimary : theme.colors.textPrimary}
      />
    </Touchable>
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
        <PermissionGuardView
          blocked={permission.isBlocked}
          onPress={permission.isBlocked ? permission.openSettings : permission.request}
        />
      );
    }

    return (
      <View style={commonStyles.flex1}>
        <View>
          <CropViewport
            ref={viewportRef}
            testID={TEST_IDS.CREATE_POST.PREVIEW}
            imageUri={preview?.uri}
            imageWidth={preview?.width}
            imageHeight={preview?.height}
            aspect={aspectRatio}
            mask={MASK_SHAPES.NONE}
            initialTransform={previewFraming}
          />

          <Touchable
            onPress={cycleAspectRatio}
            activeOpacity={0.7}
            accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
            accessibilityLabel={t(TRANSLATION_KEYS.CREATE_POST_CHANGE_SHAPE)}
            testID={TEST_IDS.CREATE_POST.CROP_SHAPE}
            style={[
              commonStyles.center,
              styles.roundButton,
              styles.shapeButton,
              { backgroundColor: theme.colors.backdropOverlay },
            ]}
          >
            <Icon
              type="Ionicons"
              name={APP_ICONS.CROP_SHAPE}
              size={iconSize.sm}
              color={theme.colors.onOverlay}
            />
          </Touchable>
        </View>

        <MediaPickerControlBar
          albumLabel={albumLabel}
          onOpenAlbums={handleOpenAlbums}
          onTakePhoto={handleTakePhoto}
          extraActions={multiSelectButton}
        />

        <View style={commonStyles.flex1}>
          <MediaGrid
            photos={photos}
            selectedPhotoId={preview?.uri}
            onSelectPhoto={selectPhoto}
            onLoadMorePhotos={loadMorePhotos}
            isLoadingMore={isLoadingMore}
            multiSelect={isMultiSelect}
            selectionOrder={selectionOrder}
          />
        </View>

        <AlbumSelectSheet
          bottomSheetRef={albumSheetRef}
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
          title={t(TRANSLATION_KEYS.CREATE_POST_TITLE)}
          backIcon={HEADER_BACK_ICON.CLOSE}
          onBack={handleClose}
          right={headerRight}
          showBottomBorder
        />
      }
    >
      {renderBody()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  roundButton: {
    width: sizes.roundButton,
    height: sizes.roundButton,
    borderRadius: sizes.roundButton / 2,
  },
  shapeButton: {
    position: 'absolute',
    bottom: spacing.md,
    start: spacing.md,
  },
});
