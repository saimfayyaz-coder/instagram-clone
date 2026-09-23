import React from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';

export interface AppLoaderProps extends Omit<ActivityIndicatorProps, 'color'> {
  color?: string;
  size?: 'small' | 'large' | number;
  fullScreen?: boolean;
  overlay?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  color,
  size = 'small',
  fullScreen = false,
  overlay = false,
  style,
  ...restProps
}) => {
  const { theme } = useTheme();
  const loaderColor = color ?? theme.colors.actionPrimary;

  const indicator = (
    <ActivityIndicator
      size={size}
      color={loaderColor}
      style={!fullScreen && !overlay ? style : undefined}
      {...restProps}
    />
  );

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreen,
          { backgroundColor: theme.colors.bgPrimary },
          style,
        ]}
      >
        {indicator}
      </View>
    );
  }

  if (overlay) {
    return (
      <View style={[styles.overlay, style]}>
        {indicator}
      </View>
    );
  }

  return indicator;
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
});
