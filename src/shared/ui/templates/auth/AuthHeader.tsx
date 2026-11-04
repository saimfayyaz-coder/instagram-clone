import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Touchable } from '@/shared/ui/primitives/Touchable';
import { InstagramLogo, Text } from '@/shared/ui/primitives';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { commonStyles } from '@/shared/theme';
import { LanguageDropdownButton } from './LanguageDropdownButton';

export interface AuthHeaderProps {
  showLogo?: boolean;
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
  showLanguageSelector?: boolean;
  onLanguagePress?: () => void;
  style?: any;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  showLogo = true,
  title: _title,
  subtitle: _subtitle,
  onBackPress,
  showLanguageSelector = false,
  onLanguagePress,
  style,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={[
        commonStyles.fullWidth,
        commonStyles.center,
        styles.container,
        {
          marginTop: theme.spacing.lg,
          marginBottom: theme.spacing.hero,
        },
        style,
      ]}
    >
      {onBackPress && (
        <Touchable
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
          accessibilityLabel={t(TRANSLATION_KEYS.COMMON_BACK)}
        >
          <Text variant="body" weight="semibold" color={theme.colors.textPrimary}>
            ‹
          </Text>
        </Touchable>
      )}

      {showLanguageSelector && onLanguagePress && (
        <View style={[styles.languageWrapper, { marginBottom: theme.spacing.xl }]}>
          <LanguageDropdownButton onPress={onLanguagePress} />
        </View>
      )}

      {showLogo && (
        <View style={commonStyles.center}>
          <InstagramLogo size={68} />
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  languageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
});
