import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Image as RNImage } from 'react-native';
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
import { GALLERY_CONFIG } from '@/shared/constants';

export interface CropViewportHandle {
  getTransforms: () => {
    scale: number;
    translateX: number;
    translateY: number;
    viewportSize: number;
  };
}

export interface CropViewportProps {
  imageUri?: string;
  imageWidth?: number;
  imageHeight?: number;
  maskShape?: 'circle' | 'square' | 'none';
}

export const CropViewport = forwardRef<CropViewportHandle, CropViewportProps>(
  (
    {
      imageUri,
      imageWidth = GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
      imageHeight = GALLERY_CONFIG.DEFAULT_IMAGE_DIMENSION,
      maskShape = 'circle',
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const { width: windowWidth } = useWindowDimensions();
    const viewportSize = windowWidth;

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Reset transforms whenever a new image is selected
    useEffect(() => {
      scale.value = withTiming(1, { duration: 150 });
      savedScale.value = 1;
      translateX.value = withTiming(0, { duration: 150 });
      savedTranslateX.value = 0;
      translateY.value = withTiming(0, { duration: 150 });
      savedTranslateY.value = 0;
    }, [imageUri, scale, savedScale, translateX, savedTranslateX, translateY, savedTranslateY]);

    useImperativeHandle(ref, () => ({
      getTransforms: () => ({
        scale: scale.value,
        translateX: translateX.value,
        translateY: translateY.value,
        viewportSize,
      }),
    }));

    // Calculate base rendering dimensions to cover viewport
    const baseScale = Math.max(
      viewportSize / (imageWidth || 1),
      viewportSize / (imageHeight || 1),
    );
    const renderedBaseWidth = imageWidth * baseScale;
    const renderedBaseHeight = imageHeight * baseScale;

    const pinchGesture = usePinchGesture({
      onUpdate: (e) => {
        'worklet';
        const nextScale = savedScale.value * e.scale;
        scale.value = Math.max(
          GALLERY_CONFIG.MIN_PINCH_ZOOM,
          Math.min(nextScale, GALLERY_CONFIG.MAX_PINCH_ZOOM),
        );
      },
      onFinalize: () => {
        'worklet';
        savedScale.value = scale.value;
      },
    });

    const panGesture = usePanGesture({
      onUpdate: (e) => {
        'worklet';
        const currentScale = scale.value;
        const currentWidth = renderedBaseWidth * currentScale;
        const currentHeight = renderedBaseHeight * currentScale;

        const maxPanX = Math.max(0, (currentWidth - viewportSize) / 2);
        const maxPanY = Math.max(0, (currentHeight - viewportSize) / 2);

        const nextX = savedTranslateX.value + e.translationX;
        const nextY = savedTranslateY.value + e.translationY;

        translateX.value = Math.max(-maxPanX, Math.min(maxPanX, nextX));
        translateY.value = Math.max(-maxPanY, Math.min(maxPanY, nextY));
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

    const circleRadius = viewportSize / 2 - 16;
    const centerPoint = viewportSize / 2;

    return (
      <View
        style={[
          commonStyles.center,
          styles.viewport,
          {
            width: viewportSize,
            height: viewportSize,
            backgroundColor: theme.colors.bgPrimary,
          },
        ]}
      >
        {imageUri ? (
          <GestureDetector gesture={combinedGesture}>
            <View style={[commonStyles.center, commonStyles.fullWidth, styles.imageContainer]}>
              <Animated.View style={[commonStyles.center, animatedImageStyle]}>
                <RNImage
                  source={{ uri: imageUri }}
                  style={{
                    width: renderedBaseWidth,
                    height: renderedBaseHeight,
                  }}
                  resizeMode="cover"
                />
              </Animated.View>
            </View>
          </GestureDetector>
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                width: viewportSize,
                height: viewportSize,
                backgroundColor: theme.colors.surface,
              },
            ]}
          />
        )}

        {/* Circular Mask Overlay */}
        {maskShape === 'circle' && (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.overlayContainer]}
          >
            <Svg width={viewportSize} height={viewportSize}>
              <Defs>
                <Mask id="circleCropMask">
                  <Rect width="100%" height="100%" fill="white" />
                  <Circle
                    cx={centerPoint}
                    cy={centerPoint}
                    r={circleRadius}
                    fill="black"
                  />
                </Mask>
              </Defs>
              <Rect
                width="100%"
                height="100%"
                fill={theme.colors.backdropOverlay}
                mask="url(#circleCropMask)"
              />
              <Circle
                cx={centerPoint}
                cy={centerPoint}
                r={circleRadius}
                stroke={theme.colors.borderFocus}
                strokeWidth={1}
                fill="transparent"
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
  imageContainer: {
    height: '100%',
  },
  placeholder: {},
  overlayContainer: {
    zIndex: 10,
  },
});
