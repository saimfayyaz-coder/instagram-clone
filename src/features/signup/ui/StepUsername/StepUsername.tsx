import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Icon, AppLoader } from '@/shared/components/atoms';
import { FormField, AuthStepHeader } from '@/shared/components/molecules';
import { useTheme, useDebouncedCallback } from '@/shared/hooks';
import { authStepStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { useLazyCheckUsernameQuery } from '../../api/signupApi';
import {
  createStep1UsernameSchema,
  Step1UsernameSchemaType,
  USERNAME_MIN_LENGTH,
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

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [triggerCheck, { isFetching }] = useLazyCheckUsernameQuery();

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

  const { debouncedCallback: debouncedCheck, cancel: cancelDebounce } =
    useDebouncedCallback(async (username: string) => {
      if (username.length < USERNAME_MIN_LENGTH) return;

      try {
        const res = await triggerCheck(username).unwrap();
        const available = res.data?.isAvailable ?? false;
        setIsAvailable(available);
        if (!available) {
          setError('username', {
            type: 'manual',
            message: t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_TAKEN),
          });
        } else {
          clearErrors('username');
        }
      } catch {
        setIsAvailable(null);
      }
    }, 400);

  const checkAvailability = (username: string) => {
    setIsAvailable(null);
    debouncedCheck(username);
  };

  const handleNext = handleSubmit(async values => {
    cancelDebounce();
    const cleanUsername = values.username.trim();

    // If already checked and unavailable
    if (isAvailable === false) {
      setError('username', {
        type: 'manual',
        message: t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_TAKEN),
      });
      return;
    }

    // If available already confirmed, proceed
    if (isAvailable === true) {
      onNext(cleanUsername);
      return;
    }

    // If not checked yet, check now
    try {
      const res = await triggerCheck(cleanUsername).unwrap();
      const available = res.data?.isAvailable ?? false;
      setIsAvailable(available);

      if (available) {
        onNext(cleanUsername);
      } else {
        setError('username', {
          type: 'manual',
          message: t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_TAKEN),
        });
      }
    } catch {
      onNext(cleanUsername);
    }
  });

  const renderRightElement = () => {
    if (isFetching) {
      return <AppLoader size="small" />;
    }
    if (isAvailable === true && !errors.username) {
      return (
        <Icon
          type="Ionicons"
          name="checkmark-circle"
          size={20}
          color={theme.colors.success}
        />
      );
    }
    return null;
  };

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
            onChangeText={text => {
              const clean = text.toLowerCase().replace(/\s/g, '');
              onChange(clean);
              checkAvailability(clean);
            }}
            onBlur={onBlur}
            errorMessage={error?.message}
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
        onPress={() => handleNext()}
        loading={isFetching}
        style={{ marginTop: theme.spacing.xs }}
      />
    </View>
  );
};
