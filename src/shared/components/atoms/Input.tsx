import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TargetedEvent,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface InputProps extends RNTextInputProps {
  error?: boolean;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  error,
  rightElement,
  style,
  onFocus,
  onBlur,
  maxFontSizeMultiplier = 1.3,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.borderFocus;
    return theme.colors.border;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.bgSecondary,
          borderColor: getBorderColor(),
          borderRadius: theme.borderRadius.sm,
        },
      ]}
    >
      <RNTextInput
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        placeholderTextColor={theme.colors.textSecondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[
          styles.input,
          {
            color: theme.colors.textPrimary,
            fontSize: theme.typography.fontSizes.md,
            paddingStart: theme.spacing.md,
            paddingEnd: rightElement ? theme.spacing.xs : theme.spacing.md,
            paddingVertical: theme.spacing.md,
          },
          style,
        ]}
        {...props}
      />
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 44,
  },
  input: {
    flex: 1,
    textAlign: 'auto',
    includeFontPadding: false,
  },
  rightElement: {
    paddingEnd: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
