import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '@/shared/hooks';

export interface AppSkeletonProps {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  borderRadius?: number;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppSkeleton: React.FC<AppSkeletonProps> = ({
  width,
  height,
  borderRadius = 4,
  circle = false,
  style,
}) => {
  const { theme } = useTheme();
  const [layoutWidth, setLayoutWidth] = useState<number>(
    typeof width === 'number' ? width : 100
  );
  const [layoutHeight, setLayoutHeight] = useState<number>(
    typeof height === 'number' ? height : 100
  );

  const translateX = useRef(new Animated.Value(-layoutWidth)).current;

  useEffect(() => {
    translateX.setValue(-layoutWidth);
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: layoutWidth * 1.5,
        duration: 1250,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [layoutWidth, translateX]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (w > 0 && w !== layoutWidth) {
      setLayoutWidth(w);
    }
    if (h > 0 && h !== layoutHeight) {
      setLayoutHeight(h);
    }
  };

  const finalBorderRadius = circle
    ? typeof width === 'number'
      ? width / 2
      : layoutWidth / 2
    : borderRadius;

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius: finalBorderRadius,
          backgroundColor: theme.colors.avatarShimmer,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            width: layoutWidth,
            height: layoutHeight,
            transform: [{ translateX }],
          },
        ]}
      >
        <Svg width={layoutWidth} height={layoutHeight}>
          <Defs>
            <LinearGradient id="skeletonShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop
                offset="0%"
                stopColor={theme.colors.shimmerHighlight}
                stopOpacity="0"
              />
              <Stop
                offset="50%"
                stopColor={theme.colors.shimmerHighlight}
                stopOpacity="0.7"
              />
              <Stop
                offset="100%"
                stopColor={theme.colors.shimmerHighlight}
                stopOpacity="0"
              />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={layoutWidth}
            height={layoutHeight}
            fill="url(#skeletonShine)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
