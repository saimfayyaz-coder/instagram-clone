import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppText, Button } from '@/shared/components/atoms';
import { FormField } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme/scaling';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import {
  createStep2PasswordSchema,
  Step2PasswordSchemaType,
} from '../../model/signupSchemas';

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
    formState: { isValid },
  } = useForm<Step2PasswordSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: initialPassword || '',
      confirmPassword: initialConfirmPassword || '',
    },
  });

  const handleNext = handleSubmit((values) => {
    onNext(values.password, values.confirmPassword);
  });

  return (
    <View style={styles.container}>
      {/* ─── LEFT-ALIGNED HEADER ────────────────────────────────────────── */}
      <AppText
        variant="heading"
        weight="bold"
        align="left"
        color={theme.colors.textPrimary}
        style={styles.title}
      >
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP2_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        align="left"
        style={[styles.subtitle, { marginBottom: theme.spacing.xl }]}
      >
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP2_SUBTITLE)}
      </AppText>

      {/* ─── INPUTS & BUTTON WITH REACT-HOOK-FORM ───────────────────────── */}
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

      <Button
        title={t(TRANSLATION_KEYS.COMMON_NEXT)}
        variant="primary"
        onPress={() => handleNext()}
        style={{ marginTop: theme.spacing.xs }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: ms(22),
    lineHeight: ms(28),
    marginBottom: ms(8),
  },
  subtitle: {
    fontSize: ms(14),
    lineHeight: ms(20),
  },
});
