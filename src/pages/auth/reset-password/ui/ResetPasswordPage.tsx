import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ResetPasswordWidget } from '@/widgets/reset-password';
import { AuthStackParamList } from '@/shared/types';
import { AUTH_ROUTES } from '@/shared/constants';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  typeof AUTH_ROUTES.RESET_PASSWORD
>;

export const ResetPasswordPage: React.FC<Props> = ({ route, navigation }) => {
  const { email, resetToken } = route.params;

  const handleNavigateBack = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  const handleResetSuccess = () => {
    // On success, backend returns fresh accessToken and authListenerMiddleware
    // automatically handles tokens and user state, navigating to Main app.
  };

  return (
    <ResetPasswordWidget
      email={email}
      resetToken={resetToken}
      onNavigateBack={handleNavigateBack}
      onResetSuccess={handleResetSuccess}
    />
  );
};
