import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ForgotPasswordWidget } from '@/widgets/forgot-password';
import { AuthStackParamList } from '@/shared/types';
import { AUTH_ROUTES, OTP_PURPOSES } from '@/shared/constants';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  typeof AUTH_ROUTES.FORGOT_PASSWORD
>;

export const ForgotPasswordPage: React.FC<Props> = ({ navigation }) => {
  const handleNavigateBack = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  const handleCodeSent = (email: string) => {
    navigation.navigate(AUTH_ROUTES.OTP_VERIFICATION, {
      email,
      flowContext: OTP_PURPOSES.FORGOT_PASSWORD,
    });
  };

  return (
    <ForgotPasswordWidget
      onNavigateBack={handleNavigateBack}
      onCodeSent={handleCodeSent}
    />
  );
};
