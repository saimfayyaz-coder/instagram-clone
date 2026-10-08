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
import { useTheme } from '@/shared/hooks/useTheme';
import { AppText } from './AppText';
import { AppLoader } from '../loader/AppLoader';
import { BUTTON_VARIANTS, ButtonVariant, ACCESSIBILITY_ROLES } from '@/shared/constants';
import { ms } from '@/shared/theme';

export type { ButtonVariant };

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size,
  loading = false,
  disabled = false,
  leftIcon,
  style,
  textColor,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const flattenedStyle = StyleSheet.flatten(style);
  const resolvedBorderRadius =
    flattenedStyle?.borderRadius ??
    (variant === BUTTON_VARIANTS.SECONDARY
      ? theme.borderRadius.md
      : theme.borderRadius.full);

  const resolvedSize: ButtonSize =
    size ?? (variant === BUTTON_VARIANTS.SECONDARY ? 'sm' : 'md');

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
    if (variant === BUTTON_VARIANTS.SECONDARY) {
      return disabled
        ? theme.colors.actionSecondaryDisabled
        : theme.colors.actionSecondary;
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
    if (textColor) {
      return textColor;
    }
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

  const getSizeStyle = (): ViewStyle => {
    if (variant === BUTTON_VARIANTS.GHOST) {
      return styles.sizeGhost;
    }
    if (resolvedSize === 'sm') {
      return styles.sizeSm;
    }
    return styles.sizeMd;
  };

  return (
    <Pressable
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.pressable, style]}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      {...props}
    >
      <Animated.View
        style={[
          styles.buttonContent,
          getSizeStyle(),
          {
            backgroundColor: getBackgroundColor(),
            borderRadius: resolvedBorderRadius,
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sizeSm: {
    minHeight: ms(32),
    paddingVertical: ms(6),
    paddingHorizontal: ms(12),
  },
  sizeMd: {
    minHeight: ms(44),
    paddingVertical: ms(12),
    paddingHorizontal: ms(16),
  },
  sizeGhost: {
    minHeight: ms(36),
    paddingVertical: ms(4),
    paddingHorizontal: ms(12),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
