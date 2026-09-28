import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components/atoms';
import {
  OtpCodeInput,
  OtpResendTimer,
  AuthStepHeader,
} from '@/shared/components/molecules';
import { useTheme, useToast } from '@/shared/hooks';
import { authStepStyles } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { executeFormMutation } from '@/shared/lib/forms';
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from '../api/otpApi';
import { useOtpTimer } from '../model/useOtpTimer';
import { createOtpSchema, OtpSchemaType } from '../model/otpSchema';
import { OtpPurpose, VerifyOtpResponseData } from '../model/types';

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
  const { showToast } = useToast();

  const [hasError, setHasError] = useState(false);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const { secondsLeft, canResend, resetTimer } = useOtpTimer({
    initialSeconds: 60,
    autoStart: true,
  });

  const schema = useMemo(() => createOtpSchema(t), [t]);

  const { control, handleSubmit } = useForm<OtpSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  const handleVerify = async (codeToVerify: string) => {
    setHasError(false);

    await executeFormMutation({
      mutationPromise: verifyOtp({
        email,
        otp: codeToVerify,
        purpose,
      }).unwrap(),
      onSuccess: (response) => {
        onSuccess?.(response.data);
      },
      onError: (err) => {
        setHasError(true);
        showToast(err.message);
      },
    });
  };

  const handleResend = async () => {
    setHasError(false);

    await executeFormMutation({
      mutationPromise: resendOtp({ email, purpose }).unwrap(),
      onSuccess: () => {
        resetTimer();
        showToast(t(TRANSLATION_KEYS.AUTH_OTP_CODE_SENT_SUCCESS));
      },
      onError: (err) => {
        showToast(err.message);
      },
    });
  };

  const onSubmitForm = handleSubmit((values) => {
    handleVerify(values.otp);
  });

  return (
    <View style={authStepStyles.container}>
      <AuthStepHeader
        title={t(TRANSLATION_KEYS.AUTH_OTP_TITLE)}
        subtitle={t(TRANSLATION_KEYS.AUTH_OTP_INSTRUCTION, { email })}
      />

      <Controller
        name="otp"
        control={control}
        render={({ field: { onChange, value } }) => (
          <OtpCodeInput
            value={value}
            onChange={(val) => {
              setHasError(false);
              onChange(val);
              if (val.length === 6) {
                handleVerify(val);
              }
            }}
            hasError={hasError}
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
