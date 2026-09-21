import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../atoms/AppText';
import { Button, ButtonVariant } from '../atoms/Button';
import { useTheme } from '../../hooks/useTheme';

export interface AuthFooterProps {
  // New modern button action (e.g., "Create new account")
  buttonText?: string;
  onPressButton?: () => void;
  buttonVariant?: ButtonVariant;
  // Legacy or inline text prompt
  promptText?: string;
  actionText?: string;
  onPressAction?: () => void;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  buttonText,
  onPressButton,
  buttonVariant = 'outline',
  promptText,
  actionText,
  onPressAction,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,

      ]}
    >
      {buttonText && onPressButton ? (
        <Button
          title={buttonText}
          variant={buttonVariant}
          onPress={onPressButton}
          style={{ width: '100%' }}
        />
      ) : null}

      {promptText && actionText && onPressAction ? (
        <View
          style={[
            styles.row,
            buttonText ? { marginTop: theme.spacing.md } : null,
          ]}
        >
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {promptText}{' '}
          </AppText>
          <TouchableOpacity onPress={onPressAction} activeOpacity={0.7}>
            <AppText
              variant="caption"
              weight="semibold"
              color={theme.colors.textLink}
            >
              {actionText}
            </AppText>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
