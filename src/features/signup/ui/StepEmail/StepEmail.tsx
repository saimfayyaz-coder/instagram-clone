import React, { useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppText, Button } from '@/shared/components/atoms';
import { FormField } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks/useTheme';
import { authStepStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import {
  createStep3EmailSchema,
  Step3EmailSchemaType,
} from '../../model/signupSchemas';
import { TermsNotice } from './TermsNotice';

export interface StepEmailProps {
  initialEmail?: string;
  initialName?: string;
  onSubmit: (email: string, name: string) => Promise<void>;
  isLoading?: boolean;
  serverError?: string | null;
}

export const StepEmail: React.FC<StepEmailProps> = ({
  initialEmail = '',
  initialName = '',
  onSubmit,
  isLoading = false,
  serverError,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const schema = useMemo(() => createStep3EmailSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isValid },
  } = useForm<Step3EmailSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: initialEmail || '',
      name: initialName || '',
    },
  });

  useEffect(() => {
    if (serverError) {
      setError('email', { type: 'manual', message: serverError });
    }
  }, [serverError, setError]);

  const handleNext = handleSubmit(async (values) => {
    clearErrors();
    await onSubmit(values.email.trim(), values.name?.trim() || '');
  });

  return (
    <View style={authStepStyles.container}>
      <AppText
        variant="heading"
        weight="bold"
        align="left"
        color={theme.colors.textPrimary}
        style={authStepStyles.title}
      >
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP3_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        align="left"
        style={[authStepStyles.subtitle, { marginBottom: theme.spacing.xl }]}
      >
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP3_SUBTITLE)}
      </AppText>

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_SIGNUP_EMAIL_LABEL)}
            value={value}
            onChangeText={(text) => {
              clearErrors('email');
              onChange(text);
            }}
            onBlur={onBlur}
            errorMessage={error?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            floating
          />
        )}
      />

      <Button
        title={t(TRANSLATION_KEYS.COMMON_NEXT)}
        variant="primary"
        onPress={() => handleNext()}
        loading={isLoading}
        style={{ marginTop: theme.spacing.xs }}
      />

      <TermsNotice />
    </View>
  );
};
