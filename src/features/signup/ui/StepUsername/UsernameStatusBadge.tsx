import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks/useTheme';

export interface UsernameStatusBadgeProps {
  isChecking: boolean;
  isAvailable: boolean | null;
  errorMessage?: string | null;
}

export const UsernameStatusBadge: React.FC<UsernameStatusBadgeProps> = ({
  isChecking,
  isAvailable,
  errorMessage,
}) => {
  const { theme } = useTheme();

  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.colors.actionPrimary} />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <AppText variant="caption" color={theme.colors.error} style={styles.errorText}>
          {errorMessage}
        </AppText>
      </View>
    );
  }

  if (isAvailable === true) {
    return (
      <View style={styles.container}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 13l4 4L19 7"
            stroke="#4BB543"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <AppText variant="caption" style={styles.availableText}>
          Username is available
        </AppText>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  availableText: {
    color: '#4BB543',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 2,
  },
});
