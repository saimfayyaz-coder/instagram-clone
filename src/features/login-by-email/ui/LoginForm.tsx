import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/atoms';
import { FormField } from '@/shared/components/molecules';
import { useTheme, useToast } from '@/shared/hooks';
import { commonStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { executeFormMutation } from '@/shared/lib/forms';
import { API_ERROR_CODES } from '@/shared/constants';
import { useLoginMutation } from '../api/loginApi';
import { createLoginSchema, LoginSchemaType } from '../model/loginSchema';

export interface LoginFormProps {
  onRequireOtpVerification?: (email: string) => void;
  onForgotPasswordPress?: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onRequireOtpVerification,
  onForgotPasswordPress,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [login, { isLoading }] = useLoginMutation();

  const schema = useMemo(() => createLoginSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    await executeFormMutation({
      mutationPromise: login(values).unwrap(),
      setError,
      clearErrors,
      showToast,
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (err) => {
        const raw = err.raw as any;
        if (
          raw?.data?.errorCode === API_ERROR_CODES.EMAIL_NOT_VERIFIED ||
          raw?.data?.data?.requiresVerification
        ) {
          const email = raw?.data?.data?.email || values.identifier;
          onRequireOtpVerification?.(email);
        }
      },
    });
  };

  return (
    <View style={[commonStyles.fullWidth, commonStyles.alignCenter]}>
      <Controller
        name="identifier"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_LOGIN_IDENTIFIER_PLACEHOLDER)}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={error?.message}
            autoCapitalize="none"
            autoCorrect={false}
            floating
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_LOGIN_PASSWORD_PLACEHOLDER)}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={error?.message}
            isPassword
            autoCapitalize="none"
            floating
          />
        )}
      />

      <Button
        title={t(TRANSLATION_KEYS.AUTH_LOGIN_BUTTON)}
        variant="primary"
        loading={isLoading}
        onPress={() => handleSubmit(onSubmit)()}
        style={{ marginTop: theme.spacing.sm }}
      />

      <Button
        title={t(TRANSLATION_KEYS.AUTH_LOGIN_FORGOT_PASSWORD)}
        variant="ghost"
        onPress={onForgotPasswordPress}
        style={{ marginTop: theme.spacing.md }}
      />
    </View>
  );
};
