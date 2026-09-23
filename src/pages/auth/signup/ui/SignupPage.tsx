import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpWidget } from '@/widgets/signup';
import { AuthStackParamList } from '@/shared/types';
import { AUTH_ROUTES } from '@/shared/constants';

type Props = NativeStackScreenProps<AuthStackParamList, typeof AUTH_ROUTES.SIGNUP>;

export const SignupPage: React.FC<Props> = ({ navigation }) => {
  const handleNavigateToLogin = () => {
    navigation.navigate(AUTH_ROUTES.LOGIN);
  };

  return <SignUpWidget onNavigateToLogin={handleNavigateToLogin} />;
};
