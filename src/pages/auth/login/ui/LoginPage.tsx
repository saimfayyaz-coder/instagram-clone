import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoginWidget } from '@/widgets/login-by-email';
import { AuthStackParamList } from '@/shared/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginPage: React.FC<Props> = ({ navigation }) => {
  const handleNavigateToSignUp = () => {
    navigation.navigate('Signup');
  };

  return <LoginWidget onNavigateToSignUp={handleNavigateToSignUp} />;
};
