import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/shared/ui/primitives/Text';
import { useTheme } from '@/shared/hooks/useTheme';

export interface SheetHeaderProps {
  title: string;
}

// Centered title with a hairline underneath, used at the top of every sheet.
export const SheetHeader: React.FC<SheetHeaderProps> = ({ title }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.header,
        {
          paddingVertical: theme.spacing.md,
          marginBottom: theme.spacing.sm,
          borderBottomColor: theme.colors.divider,
        },
      ]}
    >
      <Text variant="body" weight="bold" color={theme.colors.textPrimary}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
