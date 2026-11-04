import React from 'react';
import { View } from 'react-native';
import {
  FloatingInput,
  FloatingInputProps,
  Input,
  InputProps,
  Text,
} from '@/shared/ui/primitives';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles } from '@/shared/theme';

export interface FormFieldProps
  extends Omit<FloatingInputProps, 'label' | 'onBlur' | 'onPress'>,
  Omit<InputProps, 'rightElement' | 'onBlur' | 'onPress'> {
  label?: string;
  errorMessage?: string;
  isPassword?: boolean;
  floating?: boolean;
  rightElement?: React.ReactNode;
  onPress?: () => void;
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
      <View style={[commonStyles.fullWidth, { marginBottom: theme.spacing.md }]}>
        <FloatingInput
          label={fieldLabel}
          error={!!errorMessage}
          isPassword={isPassword}
          rightElement={rightElement}
          style={style}
          {...inputProps}
        />
        {errorMessage ? (
          <Text
            variant="error"
            style={{ marginTop: theme.spacing.xs, marginStart: theme.spacing.xs }}
          >
            {errorMessage}
          </Text>
        ) : null}
      </View>
    );
  }

  // Classic non-floating variant fallback
  return (
    <View style={[commonStyles.fullWidth, { marginBottom: theme.spacing.md }]}>
      {label ? (
        <Text
          variant="caption"
          weight="medium"
          style={{ marginBottom: theme.spacing.xs }}
        >
          {label}
        </Text>
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
        <Text
          variant="error"
          style={{ marginTop: theme.spacing.xs, marginStart: theme.spacing.xs }}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};
