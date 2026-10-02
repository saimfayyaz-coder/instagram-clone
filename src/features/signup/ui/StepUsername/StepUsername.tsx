import React, { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Icon, AppLoader } from '@/shared/components/atoms';
import { FormField, AuthStepHeader } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks';
import { authStepStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { APP_ICONS } from '@/shared/constants/ui';
import { useUsernameAvailability } from '@/entities/user';
import {
  createStep1UsernameSchema,
  Step1UsernameSchemaType,
} from '../../model/signupSchemas';

export interface StepUsernameProps {
  initialValue: string;
  onNext: (username: string) => void;
}

export const StepUsername: React.FC<StepUsernameProps> = ({
  initialValue,
  onNext,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const {
    isAvailable,
    isChecking,
    availabilityError,
    checkAvailability,
    verifyImmediate,
  } = useUsernameAvailability({ debounceMs: 400 });

  const schema = useMemo(() => createStep1UsernameSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Step1UsernameSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      username: initialValue || '',
    },
  });

  const handleNext = handleSubmit(async (values) => {
    const cleanUsername = values.username.trim();

    if (isAvailable === false && availabilityError) {
      setError('username', {
        type: 'manual',
        message: availabilityError,
      });
      return;
    }

    if (isAvailable === true) {
      onNext(cleanUsername);
      return;
    }

    const available = await verifyImmediate(cleanUsername);
    if (available) {
      onNext(cleanUsername);
    } else {
      setError('username', {
        type: 'manual',
        message:
          availabilityError || t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_TAKEN),
      });
    }
  });

  const renderRightElement = useCallback(() => {
    if (isChecking) {
      return <AppLoader size="small" />;
    }
    if (isAvailable === true && !errors.username) {
      return (
        <Icon
          type="Ionicons"
          name={APP_ICONS.CHECKMARK_CIRCLE}
          size={20}
          color={theme.colors.success}
        />
      );
    }
    return null;
  }, [isChecking, isAvailable, errors.username, theme.colors.success]);

  return (
    <View style={authStepStyles.container}>
      <AuthStepHeader
        title={t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP1_TITLE)}
        subtitle={t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP1_SUBTITLE)}
      />

      <Controller
        name="username"
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <FormField
            label={t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_LABEL)}
            value={value}
            onChangeText={(text) => {
              const clean = text.toLowerCase().replace(/\s/g, '');
              onChange(clean);
              clearErrors('username');
              checkAvailability(clean);
            }}
            onBlur={onBlur}
            errorMessage={error?.message || availabilityError || undefined}
            autoCapitalize="none"
            autoCorrect={false}
            rightElement={renderRightElement()}
            floating
          />
        )}
      />

      <Button
        title={t(TRANSLATION_KEYS.COMMON_NEXT)}
        variant="primary"
        onPress={() => {
          handleNext();
        }}
        loading={isChecking}
        style={{ marginTop: theme.spacing.xs }}
      />
    </View>
  );
};
