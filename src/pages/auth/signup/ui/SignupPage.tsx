import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpWidget } from '@/widgets/signup';
import { AuthStackParamList } from '@/shared/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export const SignupPage: React.FC<Props> = ({ navigation }) => {
  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return <SignUpWidget onNavigateToLogin={handleNavigateToLogin} />;
};
