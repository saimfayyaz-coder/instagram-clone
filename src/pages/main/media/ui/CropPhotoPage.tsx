import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Header, Icon, Loader, Screen } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { commonStyles } from '@/shared/theme';
import {
  APP_ICONS,
  HEADER_BACK_ICON,
  MAIN_ROUTES,
  TEST_IDS,
  TOAST_TYPES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { cropImage, resolveMediaRequest } from '@/shared/lib/media';
import { showToast } from '@/shared/lib/toast';
import { CropViewport, CropViewportHandle } from '@/features/media-picker';

type CropPhotoRouteProp = RouteProp<MainStackParamList, typeof MAIN_ROUTES.CROP_PHOTO>;

// Crops one given photo (e.g. straight from the camera) and hands it back to whoever opened it
export const CropPhotoPage: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<CropPhotoRouteProp>();
  const { requestId, asset, crop } = params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const viewportRef = useRef<CropViewportHandle>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Leaving without a crop (back button, gesture) counts as cancel
  useEffect(() => () => resolveMediaRequest(requestId, null), [requestId]);

  const handleCancel = useCallback(() => navigation.goBack(), [navigation]);

  const handleDone = useCallback(async () => {
    const transform = viewportRef.current?.getTransform();
    if (!transform || isProcessing) return;

    setIsProcessing(true);
    try {
      resolveMediaRequest(requestId, await cropImage(asset, transform, crop));
      navigation.goBack();
    } catch {
      showToast({ message: t(TRANSLATION_KEYS.MEDIA_PICKER_CROP_FAILED), type: TOAST_TYPES.ERROR });
      setIsProcessing(false);
    }
  }, [asset, crop, isProcessing, navigation, requestId, t]);

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
            color={theme.colors.actionPrimary}
          />
        ),
        onPress: handleDone,
        accessibilityLabel: t(TRANSLATION_KEYS.COMMON_SAVE),
        testID: TEST_IDS.CROP_PHOTO.DONE,
      },
    ],
    [handleDone, isProcessing, t, theme.colors.actionPrimary],
  );

  return (
    <Screen
      header={
        <Header
          title={t(TRANSLATION_KEYS.MEDIA_PICKER_CROP_TITLE)}
          backIcon={HEADER_BACK_ICON.CLOSE}
          onBack={handleCancel}
          rightActions={rightActions}
          showBottomBorder
        />
      }
    >
      <View style={commonStyles.centerFlex}>
        <CropViewport
          ref={viewportRef}
          testID={TEST_IDS.CROP_PHOTO.VIEWPORT}
          imageUri={asset.uri}
          imageWidth={asset.width}
          imageHeight={asset.height}
          aspect={crop.aspect}
          mask={crop.mask}
        />
      </View>
    </Screen>
  );
};
