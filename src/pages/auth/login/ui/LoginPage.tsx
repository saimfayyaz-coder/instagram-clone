import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoginWidget } from '@/widgets/login-by-email';
import { AuthStackParamList } from '@/shared/types';
import { AUTH_ROUTES } from '@/shared/constants';

type Props = NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.LOGIN>;

export const LoginPage: React.FC<Props> = ({ navigation }) => {
  const handleNavigateToSignUp = () => {
    navigation.navigate(AUTH_ROUTES.SIGNUP);
  };

  const handleNavigateToForgotPassword = () => {
    navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD);
  };

  const handleRequireOtpVerification = (email: string) => {
    navigation.navigate(AUTH_ROUTES.OTP_VERIFICATION, {
      email,
      flowContext: 'login_unverified',
    });
  };

  return (
    <LoginWidget
      onNavigateToSignUp={handleNavigateToSignUp}
      onNavigateToForgotPassword={handleNavigateToForgotPassword}
      onRequireOtpVerification={handleRequireOtpVerification}
    />
  );
};
