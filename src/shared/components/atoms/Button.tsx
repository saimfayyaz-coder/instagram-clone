import React, { useRef } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  Animated,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';
import { AppLoader } from './AppLoader';
import { BUTTON_VARIANTS, ButtonVariant } from '@/shared/constants';

export type { ButtonVariant };

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  leftIcon,
  style,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: GestureResponderEvent) => {
    if (disabled || loading) return;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.88,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    onPressOut?.(e);
  };

  const getBackgroundColor = () => {
    if (variant === BUTTON_VARIANTS.PRIMARY) {
      return disabled
        ? theme.colors.actionPrimaryDisabled
        : theme.colors.actionPrimary;
    }
    return 'transparent';
  };

  const getBorderStyles = (): ViewStyle => {
    if (variant === BUTTON_VARIANTS.OUTLINE) {
      return {
        borderWidth: 1.5,
        borderColor: disabled
          ? theme.colors.border
          : theme.colors.actionPrimary,
        backgroundColor: 'transparent',
      };
    }
    return {};
  };

  const getTextColor = () => {
    if (variant === BUTTON_VARIANTS.PRIMARY) {
      return '#FFFFFF';
    }
    if (variant === BUTTON_VARIANTS.OUTLINE) {
      return disabled ? theme.colors.textSecondary : theme.colors.actionPrimary;
    }
    if (variant === BUTTON_VARIANTS.FACEBOOK) {
      return theme.colors.actionSecondaryText;
    }
    if (variant === BUTTON_VARIANTS.SECONDARY) {
      return theme.colors.textPrimary;
    }
    return theme.colors.textLink;
  };

  return (
    <Pressable
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.pressable, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      {...props}
    >
      <Animated.View
        style={[
          styles.buttonContent,
          {
            backgroundColor: getBackgroundColor(),
            borderRadius: theme.borderRadius.full,
            paddingVertical:
              variant === BUTTON_VARIANTS.GHOST ? theme.spacing.xs : theme.spacing.md,
            paddingHorizontal:
              variant === BUTTON_VARIANTS.GHOST ? theme.spacing.md : theme.spacing.lg,
            minHeight: variant === BUTTON_VARIANTS.GHOST ? 36 : 32,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
          getBorderStyles(),
        ]}
      >
        {loading ? (
          <AppLoader
            size="small"
            color={variant === BUTTON_VARIANTS.PRIMARY ? '#FFFFFF' : theme.colors.actionPrimary}
          />
        ) : (
          <View style={styles.contentRow}>
            {leftIcon && (
              <View style={{ marginEnd: theme.spacing.sm }}>{leftIcon}</View>
            )}
            <AppText
              variant={variant === BUTTON_VARIANTS.GHOST ? 'caption' : 'body'}
              weight="semibold"
              color={getTextColor()}
              align="center"
            >
              {title}
            </AppText>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  buttonContent: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
