import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  Animated,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ms } from '../../theme';
import { AppText } from './AppText';

export interface FloatingInputProps extends Omit<TextInputProps, 'onBlur'> {
  label: string;
  error?: boolean;
  isPassword?: boolean;
  rightElement?: React.ReactNode;
  onBlur?: () => void;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value = '',
  error,
  isPassword = false,
  rightElement,
  onFocus,
  onBlur,
  style,
  secureTextEntry,
  maxFontSizeMultiplier = 1.3,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasPasswordMode = isPassword || Boolean(secureTextEntry);
  const isSecure = hasPasswordMode && !showPassword;

  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  const animatedFocus = useRef(new Animated.Value(isFloating ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedFocus, {
      toValue: isFloating ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isFloating, animatedFocus]);

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.borderFocus;
    return theme.colors.border;
  };

  // Interpolate label position and scale
  const labelTranslateY = animatedFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const labelScale = animatedFocus.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const dynamicInputStyle = useMemo(
    () => ({
      color: theme.colors.textPrimary,
      fontSize: theme.typography.fontSizes.md,
      paddingTop: isFloating ? theme.spacing.lg : 0,
      paddingBottom: isFloating ? theme.spacing.xs : 0,
    }),
    [
      theme.colors.textPrimary,
      theme.typography.fontSizes.md,
      isFloating,
      theme.spacing.lg,
      theme.spacing.xs,
    ],
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bgSecondary,
          borderColor: getBorderColor(),
          borderRadius: theme.borderRadius.sm,
          paddingHorizontal: theme.spacing.md,
        },
      ]}
    >
      <View style={styles.inputWrapper}>
        {/* Animated Floating Label */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.labelContainer,
            {
              transform: [
                { translateY: labelTranslateY },
                { scale: labelScale },
              ],
            },
          ]}
        >
          <AppText
            variant="body"
            color={
              error
                ? theme.colors.error
                : isFocused
                ? theme.colors.textSecondary
                : theme.colors.textSecondary
            }
            style={styles.labelText}
          >
            {label}
          </AppText>
        </Animated.View>

        {/* Text Input */}
        <TextInput
          {...props}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isSecure}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          style={[styles.textInput, dynamicInputStyle, style]}
        />
      </View>

      {/* Right Element or Password Toggle */}
      {rightElement ? (
        <View style={{ marginStart: theme.spacing.sm }}>{rightElement}</View>
      ) : hasPasswordMode ? (
        <TouchableOpacity
          onPress={() => setShowPassword(prev => !prev)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginStart: theme.spacing.sm }}
        >
          <AppText
            variant="caption"
            weight="semibold"
            color={theme.colors.textSecondary}
          >
            {showPassword ? 'Hide' : 'Show'}
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: ms(52),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    left: 0,
    top: '32%',
    transformOrigin: 'left top',
  },
  labelText: {
    includeFontPadding: false,
  },
  textInput: {
    flex: 1,
    height: '100%',
    includeFontPadding: false,
    padding: 0,
    textAlignVertical: 'center',
  },
});
