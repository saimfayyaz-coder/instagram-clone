import React, { useMemo } from 'react';
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
  createStep2PasswordSchema,
  Step2PasswordSchemaType,
} from '../../model/signupSchemas';
import { PasswordRulesList } from './PasswordRulesList';

export interface StepPasswordProps {
  initialPassword?: string;
  initialConfirmPassword?: string;
  onNext: (password: string, confirmPassword: string) => void;
}

export const StepPassword: React.FC<StepPasswordProps> = ({
  initialPassword = '',
  initialConfirmPassword = '',
  onNext,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const schema = useMemo(() => createStep2PasswordSchema(t), [t]);

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<Step2PasswordSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: initialPassword || '',
      confirmPassword: initialConfirmPassword || '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const hasMinLength = (password?.length ?? 0) >= 6;
  const passwordsMatch = Boolean(password && confirmPassword && password === confirmPassword);
  const hasConfirmInput = Boolean(confirmPassword && confirmPassword.length > 0);

  const handleNext = handleSubmit((values) => {
    onNext(values.password, values.confirmPassword);
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
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP2_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        align="left"
        style={[authStepStyles.subtitle, { marginBottom: theme.spacing.xl }]}
      >
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP2_SUBTITLE)}
      </AppText>

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
            floating
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_SIGNUP_CONFIRM_PASSWORD_LABEL)}
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
        title={t(TRANSLATION_KEYS.COMMON_NEXT)}
        variant="primary"
        onPress={() => handleNext()}
        style={{ marginTop: theme.spacing.xs }}
      />
    </View>
  );
};
