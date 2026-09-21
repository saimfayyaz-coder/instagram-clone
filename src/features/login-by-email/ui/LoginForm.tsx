import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/atoms';
import { FormField, ErrorAlert } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { createLoginSchema, LoginSchemaType } from '../model/loginSchema';

export interface LoginFormProps {
  onSubmit: (
    values: LoginSchemaType,
    setRootError: (message: string) => void,
    setFieldError: (name: keyof LoginSchemaType, message: string) => void,
  ) => Promise<void>;
  onForgotPasswordPress?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPasswordPress,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const schema = useMemo(() => createLoginSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const setRootError = (message: string) => setError('root', { message });
  const setFieldError = (name: keyof LoginSchemaType, message: string) =>
    setError(name, { message });

  const handleLogin = handleSubmit(async (values) => {
    clearErrors('root');
    await onSubmit(values, setRootError, setFieldError);
  });

  return (
    <View style={styles.container}>
      {errors.root?.message ? (
        <ErrorAlert message={errors.root.message} />
      ) : null}

      <Controller
        name="identifier"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_LOGIN_IDENTIFIER_PLACEHOLDER)}
            value={value}
            onChangeText={(text) => {
              if (errors.root) clearErrors('root');
              onChange(text);
            }}
            onBlur={onBlur}
            errorMessage={error?.message || errors.identifier?.message}
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
            onChangeText={(text) => {
              if (errors.root) clearErrors('root');
              onChange(text);
            }}
            onBlur={onBlur}
            errorMessage={error?.message || errors.password?.message}
            isPassword
            autoCapitalize="none"
            floating
          />
        )}
      />

      <Button
        title={t(TRANSLATION_KEYS.AUTH_LOGIN_BUTTON)}
        variant="primary"
        loading={isSubmitting}
        onPress={() => {
          handleLogin();
        }}
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
