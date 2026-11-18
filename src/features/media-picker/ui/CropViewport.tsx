import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Image } from 'react-native';
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Mask, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@/shared/hooks';
import { commonStyles } from '@/shared/theme';
import { GALLERY_CONFIG, MASK_SHAPES, MaskShape } from '@/shared/constants';
import { CropTransform, getCoverScale, getPanLimits } from '@/shared/lib/media';

const RESET_DURATION = 150;
const SNAP_DURATION = 200;
const MASK_ID = 'cropMask';

export interface CropViewportHandle {
  getTransform: () => CropTransform;
}

export interface CropViewportProps {
  imageUri?: string;
  imageWidth?: number;
  imageHeight?: number;
  // Width divided by height of the crop area
  aspect: number;
  mask: MaskShape;
  testID?: string;
}

const clamp = (value: number, limit: number) => {
  'worklet';
  return Math.max(-limit, Math.min(limit, value));
};

export const CropViewport = forwardRef<CropViewportHandle, CropViewportProps>(
  (
    {
      imageUri,
      imageWidth = GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
      imageHeight = GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
      aspect,
      mask,
      testID,
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { width: viewportWidth } = useWindowDimensions();
    const viewportHeight = viewportWidth / aspect;

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Start from the centre every time a new image is shown
    useEffect(() => {
      scale.value = withTiming(1, { duration: RESET_DURATION });
      translateX.value = withTiming(0, { duration: RESET_DURATION });
      translateY.value = withTiming(0, { duration: RESET_DURATION });
      savedScale.value = 1;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    }, [imageUri, scale, savedScale, translateX, savedTranslateX, translateY, savedTranslateY]);

    useImperativeHandle(ref, () => ({
      getTransform: () => ({
        scale: scale.value,
        translateX: translateX.value,
        translateY: translateY.value,
        viewportWidth,
        viewportHeight,
      }),
    }));

    const coverScale = getCoverScale(imageWidth, imageHeight, viewportWidth, viewportHeight);
    const baseWidth = imageWidth * coverScale;
    const baseHeight = imageHeight * coverScale;

    const pinchGesture = usePinchGesture({
      onUpdate: e => {
        'worklet';
        scale.value = Math.max(
          GALLERY_CONFIG.MIN_PINCH_ZOOM,
          Math.min(savedScale.value * e.scale, GALLERY_CONFIG.MAX_PINCH_ZOOM),
        );
      },
      onFinalize: () => {
        'worklet';
        savedScale.value = scale.value;
        // Zooming out can leave an empty edge; slide the image back to cover the area
        const limits = getPanLimits(imageWidth, imageHeight, {
          scale: scale.value,
          viewportWidth,
          viewportHeight,
        });
        savedTranslateX.value = clamp(translateX.value, limits.x);
        savedTranslateY.value = clamp(translateY.value, limits.y);
        translateX.value = withTiming(savedTranslateX.value, { duration: SNAP_DURATION });
        translateY.value = withTiming(savedTranslateY.value, { duration: SNAP_DURATION });
      },
    });

    const panGesture = usePanGesture({
      onUpdate: e => {
        'worklet';
        const limits = getPanLimits(imageWidth, imageHeight, {
          scale: scale.value,
          viewportWidth,
          viewportHeight,
        });
        translateX.value = clamp(savedTranslateX.value + e.translationX, limits.x);
        translateY.value = clamp(savedTranslateY.value + e.translationY, limits.y);
      },
      onFinalize: () => {
        'worklet';
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      },
    });

    const combinedGesture = useSimultaneousGestures(panGesture, pinchGesture);

    const animatedImageStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    // The circle touches the crop edges, so the saved image matches what the circle shows
    const radius = Math.min(viewportWidth, viewportHeight) / 2;

    return (
      <View
        testID={testID}
        style={[
          commonStyles.center,
          styles.viewport,
          { width: viewportWidth, height: viewportHeight, backgroundColor: theme.colors.surface },
        ]}
      >
        {imageUri ? (
          <GestureDetector gesture={combinedGesture}>
            <View style={[StyleSheet.absoluteFill, commonStyles.center]}>
              <Animated.View style={animatedImageStyle}>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: baseWidth, height: baseHeight }}
                  resizeMode="cover"
                />
              </Animated.View>
            </View>
          </GestureDetector>
        ) : null}

        {mask === MASK_SHAPES.CIRCLE && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Svg width={viewportWidth} height={viewportHeight}>
              <Defs>
                <Mask id={MASK_ID}>
                  <Rect width="100%" height="100%" fill="white" />
                  <Circle cx={viewportWidth / 2} cy={viewportHeight / 2} r={radius} fill="black" />
                </Mask>
              </Defs>
              <Rect
                width="100%"
                height="100%"
                fill={theme.colors.backdropOverlay}
                mask={`url(#${MASK_ID})`}
              />
            </Svg>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  viewport: {
    overflow: 'hidden',
  },
});
