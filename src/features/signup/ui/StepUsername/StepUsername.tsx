import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Icon, AppLoader } from '@/shared/components/atoms';
import { FormField } from '@/shared/components/molecules';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme/scaling';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { useLazyCheckUsernameQuery } from '../../api/signupApi';
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

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [triggerCheck, { isFetching }] = useLazyCheckUsernameQuery();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const checkAvailability = (username: string) => {
    setIsAvailable(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (username.length >= 3) {
      debounceTimerRef.current = setTimeout(async () => {
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
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleNext = handleSubmit(async (values) => {
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
      return (
        <AppLoader size="small" />
      );
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
    <View style={styles.container}>
      <AppText
        variant="heading"
        weight="bold"
        align="left"
        color={theme.colors.textPrimary}
        style={styles.title}
      >
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP1_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        align="left"
        style={[styles.subtitle, { marginBottom: theme.spacing.xl }]}
      >
        {t(TRANSLATION_KEYS.AUTH_SIGNUP_STEP1_SUBTITLE)}
      </AppText>

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
