import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText, AppLoader } from '@/shared/components/atoms';
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
        <AppLoader size="small" />
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
            stroke={theme.colors.success}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <AppText
          variant="caption"
          weight="semibold"
          color={theme.colors.success}
        >
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
  errorText: {
    marginTop: 2,
  },
});
