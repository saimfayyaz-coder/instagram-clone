import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppText, Button } from '@/shared/components/atoms';
import {
  FormField,
  ErrorAlert,
  PasswordRulesList,
} from '@/shared/components/molecules';
import { parseApiError } from '@/shared/lib/errors';
import { useTheme } from '@/shared/hooks/useTheme';
import { authStepStyles, commonStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
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

  const [rootError, setRootError] = useState<string | null>(null);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const schema = useMemo(() => createPasswordSchema(t), [t]);

  const {
    control,
    handleSubmit,
    watch,
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
    setRootError(null);

    try {
      await resetPassword({
        email,
        resetToken,
        newPassword: values.password,
      }).unwrap();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const { message } = parseApiError(err);
      setRootError(message);
    }
  };

  return (
    <View style={authStepStyles.container}>
      <AppText
        variant="heading"
        weight="bold"
        align="left"
        color={theme.colors.textPrimary}
        style={authStepStyles.title}
      >
        {t(TRANSLATION_KEYS.AUTH_RESET_PASSWORD_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        align="left"
        style={[authStepStyles.subtitle, { marginBottom: theme.spacing.xl }]}
      >
        {t(TRANSLATION_KEYS.AUTH_RESET_PASSWORD_SUBTITLE)}
      </AppText>

      {rootError ? (
        <View style={[commonStyles.fullWidth, { marginBottom: theme.spacing.sm }]}>
          <ErrorAlert message={rootError} />
        </View>
      ) : null}

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
