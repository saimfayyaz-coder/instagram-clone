import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/atoms';
import {
  FormField,
  PasswordRulesList,
  AuthStepHeader,
} from '@/shared/components/molecules';
import { useTheme, useToast } from '@/shared/hooks';
import { authStepStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { executeFormMutation } from '@/shared/lib/forms';
import {
  createPasswordSchema,
  PasswordSchemaType,
} from '@/entities/password';
import { useResetPasswordMutation } from '../api/forgotPasswordApi';

export interface NewPasswordFormProps {
  email: string;
  resetToken: string;
  onSuccess?: () => void;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  email,
  resetToken,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const schema = useMemo(() => createPasswordSchema(t), [t]);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const hasMinLength = (password?.length ?? 0) >= 6;
  const passwordsMatch = Boolean(
    password && confirmPassword && password === confirmPassword,
  );
  const hasConfirmInput = Boolean(confirmPassword && confirmPassword.length > 0);

  const onSubmit = async (values: PasswordSchemaType) => {
    await executeFormMutation({
      mutationPromise: resetPassword({
        email,
        resetToken,
        newPassword: values.password,
      }).unwrap(),
      setError,
      clearErrors,
      showToast,
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <View style={authStepStyles.container}>
      <AuthStepHeader
        title={t(TRANSLATION_KEYS.AUTH_RESET_PASSWORD_TITLE)}
        subtitle={t(TRANSLATION_KEYS.AUTH_RESET_PASSWORD_SUBTITLE)}
      />

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_RESET_PASSWORD_NEW_PASSWORD_LABEL)}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={error?.message}
            isPassword
            floating
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_RESET_PASSWORD_CONFIRM_PASSWORD_LABEL)}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={error?.message}
            isPassword
            floating
          />
        )}
      />

      <PasswordRulesList
        hasMinLength={hasMinLength}
        passwordsMatch={passwordsMatch}
        hasConfirmInput={hasConfirmInput}
      />

      <Button
        title={t(TRANSLATION_KEYS.AUTH_RESET_PASSWORD_SUBMIT_BUTTON)}
        variant="primary"
        onPress={() => handleSubmit(onSubmit)()}
        loading={isLoading}
        style={{ marginTop: theme.spacing.md }}
      />
    </View>
  );
};
