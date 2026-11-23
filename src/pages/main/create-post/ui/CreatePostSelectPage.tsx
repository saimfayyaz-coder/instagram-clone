import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Header, Icon, Loader, Screen, Text, Touchable } from '@/shared/ui';
import { useGalleryMedia, usePermission, useTheme } from '@/shared/hooks';
import { commonStyles, spacing } from '@/shared/theme';
import {
  ACCESSIBILITY_ROLES,
  APP_ICONS,
  GALLERY_CONFIG,
  HEADER_BACK_ICON,
  MAIN_ROUTES,
  MASK_SHAPES,
  PERMISSION_KINDS,
  TEST_IDS,
  TOAST_TYPES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { takePhotoWithPermission } from '@/shared/lib/media';
import { showToast } from '@/shared/lib/toast';
import { useAppDispatch } from '@/app/store/hooks';
import {
  AlbumSelectSheet,
  CropViewport,
  MEDIA_PICKER_ROUND_BUTTON_SIZE,
  MediaGrid,
  MediaPickerControlBar,
  PermissionGuardView,
} from '@/features/media-picker';
import { setPostDraft, usePostMediaSelection } from '@/features/create-post';

const ICON_SIZE = 18;

export const CreatePostSelectPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const albumSheetRef = useRef<BottomSheetModal>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleNext = useCallback(async () => {
    if (!hasSelection || isProcessing) return;

    setIsProcessing(true);
    try {
      const images = await cropSelected();
      if (images.length > 0) {
        dispatch(setPostDraft({ images, aspectRatio }));
        navigation.navigate(MAIN_ROUTES.CREATE_POST_DETAILS);
      }
    } catch {
      showToast({ message: t(TRANSLATION_KEYS.MEDIA_PICKER_CROP_FAILED), type: TOAST_TYPES.ERROR });
    } finally {
      setIsProcessing(false);
    }
  }, [aspectRatio, cropSelected, dispatch, hasSelection, isProcessing, navigation, t]);

  const headerRight = useMemo(
    () =>
      isProcessing ? (
        <Loader size="small" />
      ) : (
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
    [handleNext, hasSelection, isProcessing, t, theme.colors],
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
        size={ICON_SIZE}
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
              size={ICON_SIZE}
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
    width: MEDIA_PICKER_ROUND_BUTTON_SIZE,
    height: MEDIA_PICKER_ROUND_BUTTON_SIZE,
    borderRadius: MEDIA_PICKER_ROUND_BUTTON_SIZE / 2,
  },
  shapeButton: {
    position: 'absolute',
    bottom: spacing.md,
    start: spacing.md,
  },
});
