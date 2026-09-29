import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';

export interface DividerWithTextProps {
  text: string;
}

export const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: theme.colors.divider }]} />
      <AppText
        variant="caption"
        weight="semibold"
        color={theme.colors.textSecondary}
        style={[styles.text, { paddingHorizontal: theme.spacing.md }]}
      >
        {text}
      </AppText>
      <View style={[styles.line, { backgroundColor: theme.colors.divider }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    textTransform: 'uppercase',
  },
});
