import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { AuthNavigator } from './AuthNavigator';
import { MainPage } from '@/pages/main';
import { useTheme } from '@/shared/hooks';
import {
  customNavigationLightTheme,
  customNavigationDarkTheme,
} from '@/shared/theme';
import { selectIsAuthenticated } from '@/entities/session';
import { selectCurrentUser } from '@/entities/user';

export const RootNavigator: React.FC = () => {
  const { isDark } = useTheme();
  const isSessionAuth = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = isSessionAuth || Boolean(currentUser);

  const navigationTheme = isDark
    ? customNavigationDarkTheme
    : customNavigationLightTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainPage /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
