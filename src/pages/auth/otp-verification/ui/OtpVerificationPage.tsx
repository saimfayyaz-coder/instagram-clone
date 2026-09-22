import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OtpVerificationWidget } from '@/widgets/otp-verification';
import { AuthStackParamList } from '@/shared/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationPage: React.FC<Props> = ({ route, navigation }) => {
  const { email } = route.params;

  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <OtpVerificationWidget
      email={email}
      purpose="login_unverified"
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
};
