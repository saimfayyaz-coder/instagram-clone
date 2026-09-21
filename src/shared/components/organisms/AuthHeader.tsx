import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { InstagramLogo } from '../atoms/InstagramLogo';
import { AppText } from '../atoms/AppText';
import { useTheme } from '../../hooks/useTheme';

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
        <View style={styles.logoWrapper}>
          <InstagramLogo size={68} />
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    padding: 8,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
