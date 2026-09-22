import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks/useTheme';

export const TermsNotice: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <AppText
        variant="caption"
        align="center"
        color={theme.colors.textSecondary}
        style={styles.text}
      >
        {t('auth.signup.termsNotice', {
          defaultValue:
            'By tapping Next, you agree to our Terms, Privacy Policy and Cookies Policy.',
        })}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
  },
});
