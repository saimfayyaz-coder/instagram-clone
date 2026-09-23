import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OtpVerificationWidget } from '@/widgets/otp-verification';
import { AuthStackParamList } from '@/shared/types';
import { AUTH_ROUTES } from '@/shared/constants';

type Props = NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.OTP_VERIFICATION>;

export const OtpVerificationPage: React.FC<Props> = ({ route, navigation }) => {
  const { email } = route.params;

  const handleNavigateToLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  return (
    <OtpVerificationWidget
      email={email}
      purpose="login_unverified"
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
};
