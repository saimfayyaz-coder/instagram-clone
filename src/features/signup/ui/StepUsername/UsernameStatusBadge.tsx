import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { Text, Loader } from '@/shared/ui';
import { useTheme } from '@/shared/hooks/useTheme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

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
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (isChecking) {
    return (
      <View style={styles.container}>
        <Loader size="small" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text variant="caption" color={theme.colors.error} style={styles.errorText}>
          {errorMessage}
        </Text>
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
        <Text
          variant="caption"
          weight="semibold"
          color={theme.colors.success}
        >
          {t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_AVAILABLE)}
        </Text>
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
