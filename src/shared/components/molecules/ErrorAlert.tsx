import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../atoms/AppText';
import { useTheme } from '../../hooks/useTheme';

export interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark ? '#2D1215' : '#FDE8E8',
          borderColor: theme.colors.error,
          borderRadius: theme.borderRadius.sm,
          padding: theme.spacing.md,
        },
      ]}
    >
      <AppText
        variant="body"
        color={theme.colors.error}
        align="center"
      >
        {message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    marginBottom: 16,
  },
});
