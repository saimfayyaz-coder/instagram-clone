import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles } from '@/shared/theme';

export interface ContainerProps {
  children: React.ReactNode;
  // Caps the content width and centers it (e.g. theme.layout.authMaxWidth)
  maxWidth?: number;
  // Horizontal padding. Defaults to theme.layout.gutter
  gutter?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

// Centered, width-capped content column with the standard gutter.
export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth,
  gutter,
  style,
  contentStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[commonStyles.fullWidth, commonStyles.center, style]}>
      <View
        style={[
          commonStyles.fullWidth,
          styles.inner,
          {
            maxWidth,
            paddingHorizontal: gutter ?? theme.layout.gutter,
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
