import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/atoms';
import { FormField, ErrorAlert, AuthStepHeader } from '@/shared/components/molecules';
import { parseApiError } from '@/shared/lib/errors';
import { useTheme } from '@/shared/hooks/useTheme';
import { authStepStyles, commonStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { useForgotPasswordMutation } from '../api/forgotPasswordApi';
import {
  createIdentifierSchema,
  IdentifierSchemaType,
} from '../model/identifierSchema';

export interface IdentifierFormProps {
  onSuccess: (email: string) => void;
}

export const IdentifierForm: React.FC<IdentifierFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [rootError, setRootError] = useState<string | null>(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const schema = useMemo(() => createIdentifierSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentifierSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { identifier: '' },
  });

  const onSubmit = async (values: IdentifierSchemaType) => {
    setRootError(null);

    try {
      const response = await forgotPassword({
        identifier: values.identifier,
      }).unwrap();
      onSuccess(response.data.email);
    } catch (err) {
      const { message } = parseApiError(err);
      setRootError(message);
    }
  };

  return (
    <View style={authStepStyles.container}>
      <AuthStepHeader
        title={t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_TITLE)}
        subtitle={t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_SUBTITLE)}
      />

      {rootError ? (
        <View style={[commonStyles.fullWidth, { marginBottom: theme.spacing.sm }]}>
          <ErrorAlert message={rootError} />
        </View>
      ) : null}

      <Controller
        name="identifier"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_IDENTIFIER_LABEL)}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={error?.message}
            autoCapitalize="none"
            floating
          />
        )}
      />

      <Button
        title={t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_SEND_CODE)}
        variant="primary"
        onPress={() => handleSubmit(onSubmit)()}
        loading={isLoading}
        style={{ marginTop: theme.spacing.md }}
      />
    </View>
  );
};
