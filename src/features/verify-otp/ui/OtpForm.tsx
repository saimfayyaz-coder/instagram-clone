import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { AppText, Button } from '@/shared/components/atoms';
import {
  ErrorAlert,
  OtpCodeInput,
  OtpResendTimer,
} from '@/shared/components/molecules';
import { parseApiError } from '@/shared/lib/errors';
import { useTheme } from '@/shared/hooks/useTheme';
import { authStepStyles, commonStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
  useOtpTimer,
  createOtpSchema,
  OtpSchemaType,
  OtpPurpose,
  VerifyOtpResponseData,
} from '@/entities/otp';

export interface OtpFormProps {
  email: string;
  purpose?: OtpPurpose;
  onSuccess?: (data?: VerifyOtpResponseData) => void;
  onBackPress?: () => void;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  email,
  purpose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const { secondsLeft, canResend, resetTimer } = useOtpTimer({
    initialSeconds: 60,
    autoStart: true,
  });

  const schema = useMemo(() => createOtpSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  const handleVerify = async (codeToVerify: string) => {
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const response = await verifyOtp({
        email,
        otp: codeToVerify,
        purpose,
      }).unwrap();
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      const { message } = parseApiError(err);
      setErrorMessage(message);
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      await resendOtp({ email, purpose }).unwrap();
      resetTimer();
      setInfoMessage(t(TRANSLATION_KEYS.AUTH_OTP_CODE_SENT_SUCCESS));
    } catch (err) {
      const { message } = parseApiError(err);
      setErrorMessage(message);
    }
  };

  const onSubmitForm = handleSubmit((values) => {
    handleVerify(values.otp);
  });

  const displayError = errorMessage || errors.otp?.message;

  return (
    <View style={authStepStyles.container}>
      <AppText
        variant="heading"
        weight="bold"
        align="left"
        color={theme.colors.textPrimary}
        style={authStepStyles.title}
      >
        {t(TRANSLATION_KEYS.AUTH_OTP_TITLE)}
      </AppText>

      <AppText
        variant="body"
        color={theme.colors.textSecondary}
        align="left"
        style={[authStepStyles.subtitle, { marginBottom: theme.spacing.md }]}
      >
        {t(TRANSLATION_KEYS.AUTH_OTP_INSTRUCTION, { email })}
      </AppText>

      {displayError ? (
        <View style={[commonStyles.fullWidth, { marginBottom: theme.spacing.sm }]}>
          <ErrorAlert message={displayError} />
        </View>
      ) : null}

      {infoMessage ? (
        <View style={[commonStyles.fullWidth, { marginBottom: theme.spacing.sm }]}>
          <AppText
            variant="caption"
            weight="semibold"
            align="center"
            color={theme.colors.actionPrimary}
          >
            {infoMessage}
          </AppText>
        </View>
      ) : null}

      <Controller
        name="otp"
        control={control}
        render={({ field: { onChange, value } }) => (
          <OtpCodeInput
            value={value}
            onChange={(val) => {
              onChange(val);
              if (val.length === 6) {
                handleVerify(val);
              }
            }}
            hasError={Boolean(displayError)}
            disabled={isVerifying}
          />
        )}
      />

      <Button
        title={t(TRANSLATION_KEYS.COMMON_NEXT)}
        variant="primary"
        onPress={() => onSubmitForm()}
        loading={isVerifying}
        style={{ marginTop: theme.spacing.sm }}
      />

      <OtpResendTimer
        secondsLeft={secondsLeft}
        canResend={canResend}
        onResend={handleResend}
        isLoading={isResending}
      />
    </View>
  );
};
