import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Icon } from '@/shared/components/atoms';
import { FormField, ErrorAlert } from '@/shared/components/molecules';
import { parseApiError } from '@/shared/lib/errors';
import { useTheme } from '@/shared/hooks/useTheme';
import { authStepStyles, commonStyles, ms } from '@/shared/theme';
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
    setError,
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
      const { message, fieldErrors } = parseApiError(err);
      if (fieldErrors?.identifier?.[0]) {
        setError('identifier', { message: fieldErrors.identifier[0] });
      } else {
        setRootError(message);
      }
    }
  };

  return (
    <View style={authStepStyles.container}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <Icon
            type="Ionicons"
            name="lock-closed-outline"
            size={ms(40)}
            color={theme.colors.textPrimary}
          />
        </View>
      </View>

      <AppText
        variant="heading"
        weight="bold"
        align="center"
        color={theme.colors.textPrimary}
        style={styles.title}
      >
        {t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        align="center"
        style={styles.subtitle}
      >
        {t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_SUBTITLE)}
      </AppText>

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

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginBottom: ms(16),
  },
  iconCircle: {
    width: ms(84),
    height: ms(84),
    borderRadius: ms(42),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: ms(8),
  },
  subtitle: {
    marginBottom: ms(24),
    paddingHorizontal: ms(12),
    lineHeight: ms(20),
  },
});
