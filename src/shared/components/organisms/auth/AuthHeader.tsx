import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { InstagramLogo, AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { commonStyles } from '@/shared/theme';
import { LanguageDropdownButton } from '@/shared/components/molecules';

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
        <TouchableOpacity
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[styles.backButton, { left: 0 }]}
          accessibilityLabel="Go back"
        >
          <AppText variant="body" weight="semibold" color={theme.colors.textPrimary}>
            ‹
          </AppText>
        </TouchableOpacity>
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
    padding: 8,
  },
});
