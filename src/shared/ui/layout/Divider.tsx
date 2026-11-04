import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';

export interface DividerProps {
  vertical?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Hairline separator in the theme divider color.
export const Divider: React.FC<DividerProps> = ({ vertical = false, style }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: theme.colors.divider },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
});
