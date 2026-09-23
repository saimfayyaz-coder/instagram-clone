import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/shared/types';
import { AUTH_ROUTES } from '@/shared/constants';
import { LoginPage } from '@/pages/auth/login';
import { SignupPage } from '@/pages/auth/signup';
import { OtpVerificationPage } from '@/pages/auth/otp-verification';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginPage} />
      <Stack.Screen name={AUTH_ROUTES.SIGNUP} component={SignupPage} />
      <Stack.Screen name={AUTH_ROUTES.OTP_VERIFICATION} component={OtpVerificationPage} />
    </Stack.Navigator>
  );
};
