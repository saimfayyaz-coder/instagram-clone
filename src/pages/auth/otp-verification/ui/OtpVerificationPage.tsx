import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OtpVerificationWidget } from '@/widgets/otp-verification';
import { AuthStackParamList } from '@/shared/types';
import { AUTH_ROUTES, OTP_PURPOSES } from '@/shared/constants';
import { VerifyOtpResponseData } from '@/entities/otp';

type Props = NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.OTP_VERIFICATION>;

export const OtpVerificationPage: React.FC<Props> = ({ route, navigation }) => {
  const { email, flowContext = OTP_PURPOSES.LOGIN_UNVERIFIED } = route.params;

  const handleNavigateToLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  const handleVerifiedSuccess = (data?: VerifyOtpResponseData) => {
    if (flowContext === OTP_PURPOSES.FORGOT_PASSWORD && data?.resetToken) {
      navigation.navigate(AUTH_ROUTES.RESET_PASSWORD, {
        email,
        resetToken: data.resetToken,
      });
    }
  };

  return (
    <OtpVerificationWidget
      email={email}
      purpose={flowContext}
      onNavigateToLogin={handleNavigateToLogin}
      onVerifiedSuccess={handleVerifiedSuccess}
    />
  );
};

