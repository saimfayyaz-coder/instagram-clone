import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { GestureDetector, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Icon, Text } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { commonStyles, iconSize, motion, ms, spacing } from '@/shared/theme';
import { APP_ICONS, TEST_IDS } from '@/shared/constants';
import { PostImage } from '../model/types';

export interface PostMediaCarouselProps {
  images: PostImage[];
  aspectRatio: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onDoubleTap: () => void;
}

export const PostMediaCarousel: React.FC<PostMediaCarouselProps> = ({
  images,
  aspectRatio,
  activeIndex,
  onIndexChange,
  onDoubleTap,
}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const height = width / aspectRatio;
  const heartScale = useSharedValue(0);

  const handleDoubleTap = useCallback(() => {
    heartScale.value = withSequence(
      withSpring(1),
      withDelay(motion.hold, withTiming(0, { duration: motion.normal })),
    );
    onDoubleTap();
  }, [heartScale, onDoubleTap]);

  const doubleTapGesture = useTapGesture({
    numberOfTaps: 2,
    runOnJS: true,
    onActivate: handleDoubleTap,
  });

  const heartStyle = useAnimatedStyle(() => ({
    opacity: heartScale.value,
    transform: [{ scale: heartScale.value }],
  }));

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onIndexChange(Math.round(event.nativeEvent.contentOffset.x / width));
    },
    [onIndexChange, width],
  );

  const renderImage: ListRenderItem<PostImage> = useCallback(
    ({ item }) => (
      <Image
        source={{ uri: item.uri }}
        style={{ width, height, backgroundColor: theme.colors.bgSecondary }}
        resizeMode="cover"
      />
    ),
    [width, height, theme.colors.bgSecondary],
  );

  const hasMultipleImages = images.length > 1;

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <View style={{ width, height }} testID={TEST_IDS.FEED.MEDIA}>
        <FlatList
          data={images}
          keyExtractor={item => item.id}
          renderItem={renderImage}
          horizontal
          pagingEnabled
          scrollEnabled={hasMultipleImages}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        />

        {hasMultipleImages && (
          <View style={[styles.counter, { backgroundColor: theme.colors.backdropOverlay }]}>
            <Text variant="caption" weight="semibold" color={theme.colors.onOverlay}>
              {`${activeIndex + 1}/${images.length}`}
            </Text>
          </View>
        )}

        <View style={[StyleSheet.absoluteFill, commonStyles.center]} pointerEvents="none">
          <Animated.View style={heartStyle}>
            <Icon
              type="Ionicons"
              name={APP_ICONS.HEART_FILLED}
              size={iconSize.hero}
              color={theme.colors.onOverlay}
            />
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  counter: {
    position: 'absolute',
    top: spacing.md,
    end: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: ms(12),
  },
});
