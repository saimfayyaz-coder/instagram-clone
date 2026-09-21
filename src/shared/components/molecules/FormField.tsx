import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FloatingInput, FloatingInputProps } from '../atoms/FloatingInput';
import { Input, InputProps } from '../atoms/Input';
import { AppText } from '../atoms/AppText';
import { useTheme } from '../../hooks/useTheme';

export interface FormFieldProps
  extends Omit<FloatingInputProps, 'label' | 'onBlur'>,
    Omit<InputProps, 'rightElement' | 'onBlur'> {
  label?: string;
  errorMessage?: string;
  isPassword?: boolean;
  floating?: boolean;
  rightElement?: React.ReactNode;
  onBlur?: (e?: any) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  errorMessage,
  isPassword = false,
  floating = true,
  rightElement,
  style,
  ...inputProps
}) => {
  const { theme } = useTheme();

  const fieldLabel = label || placeholder || '';

  if (floating) {
    return (
      <View style={[styles.container, { marginBottom: theme.spacing.md }]}>
        <FloatingInput
          label={fieldLabel}
          error={!!errorMessage}
          isPassword={isPassword}
          rightElement={rightElement}
          style={style}
          {...inputProps}
        />
        {errorMessage ? (
          <AppText
            variant="error"
            style={{ marginTop: theme.spacing.xs, marginStart: theme.spacing.xs }}
          >
            {errorMessage}
          </AppText>
        ) : null}
      </View>
    );
  }

  // Classic non-floating variant fallback
  return (
    <View style={[styles.container, { marginBottom: theme.spacing.md }]}>
      {label ? (
        <AppText
          variant="caption"
          weight="medium"
          style={{ marginBottom: theme.spacing.xs }}
        >
          {label}
        </AppText>
      ) : null}
      <Input
        placeholder={placeholder}
        error={!!errorMessage}
        secureTextEntry={isPassword}
        rightElement={rightElement}
        style={style}
        {...inputProps}
      />
      {errorMessage ? (
        <AppText
          variant="error"
          style={{ marginTop: theme.spacing.xs, marginStart: theme.spacing.xs }}
        >
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
