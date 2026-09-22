import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme/scaling';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

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
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_TERMS_NOTICE)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: ms(16),
    paddingHorizontal: ms(8),
  },
  text: {
    fontSize: ms(12),
    lineHeight: ms(16),
  },
});
