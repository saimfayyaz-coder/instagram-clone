import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  paddingHorizontal?: number;
}


export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 440,
  style,
  contentStyle,
  paddingHorizontal,
}) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  const effectivePadding =
    paddingHorizontal !== undefined ? paddingHorizontal : theme.spacing.lg;

  const containerWidth = Math.min(width, maxWidth);

  return (
    <View style={[styles.outer, style]}>
      <View
        style={[
          styles.inner,
          {
            maxWidth,
            width: width > maxWidth ? containerWidth : '100%',
            paddingHorizontal: effectivePadding,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
  },
});
