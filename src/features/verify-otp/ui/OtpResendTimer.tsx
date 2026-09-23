import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme/scaling';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface OtpResendTimerProps {
  secondsLeft: number;
  canResend: boolean;
  onResend: () => void;
  isLoading?: boolean;
}

export const OtpResendTimer: React.FC<OtpResendTimerProps> = ({
  secondsLeft,
  canResend,
  onResend,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const formattedSeconds = `0:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;

  return (
    <View style={[styles.container, { marginVertical: theme.spacing.md }]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.actionPrimary} />
      ) : canResend ? (
        <TouchableOpacity
          onPress={onResend}
          hitSlop={{ top: ms(8), bottom: ms(8), left: ms(8), right: ms(8) }}
          accessibilityRole="button"
        >
          <AppText
            variant="body"
            weight="semibold"
            color={theme.colors.actionPrimary}
          >
            {t(TRANSLATION_KEYS.AUTH_OTP_RESEND_CODE)}
          </AppText>
        </TouchableOpacity>
      ) : (
        <AppText variant="caption" color={theme.colors.textSecondary}>
          {t(TRANSLATION_KEYS.AUTH_OTP_RESEND_WAIT, {
            time: formattedSeconds,
          })}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: ms(24),
  },
});
