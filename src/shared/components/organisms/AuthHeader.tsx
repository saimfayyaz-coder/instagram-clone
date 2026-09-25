import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { InstagramLogo } from '../atoms/InstagramLogo';
import { AppText } from '../atoms/AppText';
import { useTheme } from '../../hooks/useTheme';
import { commonStyles } from '@/shared/theme';

export interface AuthHeaderProps {
  showLogo?: boolean;
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
  style?: any;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  showLogo = true,
  title,
  subtitle,
  onBackPress,
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
  backButton: {
    position: 'absolute',
    padding: 8,
  },
});
