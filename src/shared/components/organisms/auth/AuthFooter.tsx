import React from 'react';
import { View } from 'react-native';
import { Touchable } from '@/shared/components/atoms/ui/Touchable';
import { AppText, Button, ButtonVariant } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { commonStyles } from '@/shared/theme';

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
    <View style={[commonStyles.fullWidth, commonStyles.center]}>
      {buttonText && onPressButton ? (
        <Button
          title={buttonText}
          variant={buttonVariant}
          onPress={onPressButton}
          style={commonStyles.fullWidth}
        />
      ) : null}

      {promptText && actionText && onPressAction ? (
        <View
          style={[
            commonStyles.rowCenter,
            buttonText ? { marginTop: theme.spacing.md } : null,
          ]}
        >
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {promptText}{' '}
          </AppText>
          <Touchable onPress={onPressAction} activeOpacity={0.7}>
            <AppText
              variant="caption"
              weight="semibold"
              color={theme.colors.textLink}
            >
              {actionText}
            </AppText>
          </Touchable>
        </View>
      ) : null}
    </View>
  );
};
