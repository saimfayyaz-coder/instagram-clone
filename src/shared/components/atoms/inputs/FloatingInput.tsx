import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  Animated,
  StyleSheet,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';
import { AppText } from '../ui/AppText';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ACCESSIBILITY_ROLES } from '@/shared/constants';

export interface FloatingInputProps extends Omit<TextInputProps, 'onBlur'> {
  label: string;
  error?: boolean;
  isPassword?: boolean;
  rightElement?: React.ReactNode;
  onBlur?: () => void;
  onPress?: (e?: any) => void;
  horizontalScroll?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value = '',
  error,
  isPassword = false,
  rightElement,
  onFocus,
  onBlur,
  onPress,
  horizontalScroll = false,
  style,
  secureTextEntry,
  maxFontSizeMultiplier = 1.3,
  ...props
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasPasswordMode = isPassword || Boolean(secureTextEntry);
  const isSecure = hasPasswordMode && !showPassword;

  const hasValue = Boolean(value && String(value).trim().length > 0);
  const isFloating = isFocused || hasValue;

  const singleLineValue = useMemo(() => {
    if (!value) return '';
    return typeof value === 'string' ? value.replace(/\r?\n/g, ' ') : String(value);
  }, [value]);

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
      fontFamily: theme.typography.fontFamilies.regular,
      fontSize: theme.typography.fontSizes.md,
      paddingTop: isFloating ? (props.multiline ? ms(14) : theme.spacing.lg) : 0,
      paddingBottom: isFloating ? theme.spacing.xs : 0,
      ...(props.multiline
        ? {
            textAlignVertical: 'top' as const,
            minHeight: ms(65),
          }
        : {}),
    }),
    [
      theme.colors.textPrimary,
      theme.typography.fontFamilies.regular,
      theme.typography.fontSizes.md,
      isFloating,
      theme.spacing.lg,
      theme.spacing.xs,
      props.multiline,
    ],
  );

  const ContainerComponent = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress,
        accessibilityRole: ACCESSIBILITY_ROLES.BUTTON,
        accessibilityLabel: `${label}: ${value || ''}`,
      }
    : {};

  return (
    <ContainerComponent
      {...containerProps}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bgSecondary,
          borderColor: getBorderColor(),
          borderRadius: theme.borderRadius.sm,
          paddingHorizontal: theme.spacing.md,
        },
        props.multiline && {
          minHeight: ms(110),
          height: undefined,
          alignItems: 'flex-start',
          paddingVertical: ms(8),
        },
      ]}
    >
      <View
        style={[
          styles.inputWrapper,
          props.multiline && { minHeight: ms(90) },
        ]}
      >
        {/* Animated Floating Label */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.labelContainer,
            props.multiline && { top: ms(4) },
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

        {/* Text Input / Value View */}
        {horizontalScroll && onPress && hasValue ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.horizontalScrollContent}
            style={styles.horizontalScrollView}
          >
            <Pressable onPress={onPress} style={styles.scrollablePressable}>
              <AppText
                variant="body"
                color={theme.colors.textPrimary}
                style={[dynamicInputStyle, styles.horizontalScrollText]}
              >
                {singleLineValue}
              </AppText>
            </Pressable>
          </ScrollView>
        ) : (
          <TextInput
            {...props}
            value={value}
            editable={onPress ? false : props.editable}
            pointerEvents={onPress ? 'none' : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isSecure}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
            style={[
              styles.textInput,
              dynamicInputStyle,
              onPress && { color: theme.colors.textPrimary },
              style,
            ]}
          />
        )}
      </View>

      {/* Right Element or Password Toggle */}
      {rightElement ? (
        <View
          pointerEvents={onPress ? 'none' : undefined}
          style={{ marginStart: theme.spacing.sm }}
        >
          {rightElement}
        </View>
      ) : hasPasswordMode ? (
        <Pressable
          onPress={() => setShowPassword(prev => !prev)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginStart: theme.spacing.sm }}
        >
          <AppText
            variant="caption"
            weight="semibold"
            color={theme.colors.textSecondary}
          >
            {showPassword
              ? t(TRANSLATION_KEYS.COMMON_HIDE)
              : t(TRANSLATION_KEYS.COMMON_SHOW)}
          </AppText>
        </Pressable>
      ) : null}
    </ContainerComponent>
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
  horizontalScrollView: {
    flex: 1,
    height: '100%',
  },
  horizontalScrollContent: {
    alignItems: 'center',
    paddingRight: ms(16),
  },
  scrollablePressable: {
    height: '100%',
    justifyContent: 'center',
  },
  horizontalScrollText: {
    paddingBottom: 0,
    includeFontPadding: false,
  },
});
