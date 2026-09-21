import React, { useRef } from 'react';
import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'facebook';

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
    if (variant === 'primary') {
      return disabled
        ? theme.colors.actionPrimaryDisabled
        : theme.colors.actionPrimary;
    }
    return 'transparent';
  };

  const getBorderStyles = (): ViewStyle => {
    if (variant === 'outline') {
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
    if (variant === 'primary') {
      return '#FFFFFF';
    }
    if (variant === 'outline') {
      return disabled ? theme.colors.textSecondary : theme.colors.actionPrimary;
    }
    if (variant === 'facebook') {
      return theme.colors.actionSecondaryText;
    }
    if (variant === 'secondary') {
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
              variant === 'ghost' ? theme.spacing.xs : theme.spacing.md,
            paddingHorizontal:
              variant === 'ghost' ? theme.spacing.md : theme.spacing.lg,
            minHeight: variant === 'ghost' ? 36 : 32,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
          getBorderStyles(),
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : theme.colors.actionPrimary}
          />
        ) : (
          <View style={styles.contentRow}>
            {leftIcon && (
              <View style={{ marginEnd: theme.spacing.sm }}>{leftIcon}</View>
            )}
            <AppText
              variant={variant === 'ghost' ? 'caption' : 'body'}
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
