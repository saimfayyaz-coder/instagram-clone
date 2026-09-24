import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { commonStyles } from '@/shared/theme';

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
  const { theme } = useTheme();

  const effectivePadding =
    paddingHorizontal !== undefined ? paddingHorizontal : theme.spacing.lg;

  return (
    <View style={[commonStyles.fullWidth, commonStyles.center, style]}>
      <View
        style={[
          commonStyles.fullWidth,
          styles.inner,
          {
            maxWidth,
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
  inner: {
    alignSelf: 'center',
  },
});
