import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { AuthNavigator } from './auth';
import { MainNavigator } from './main';
import { useTheme } from '@/shared/hooks';
import {
  customNavigationLightTheme,
  customNavigationDarkTheme,
} from '@/shared/theme';
import { selectIsAuthenticated } from '@/entities/session';
import { selectCurrentUser } from '@/entities/user';
import {
  navigationRef,
  navigationStateMemory,
  notifyNavigationReady,
} from '@/shared/lib/navigation';

export const RootNavigator: React.FC = () => {
  const { isDark } = useTheme();
  const isSessionAuth = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = isSessionAuth || Boolean(currentUser);

  const navigationTheme = isDark
    ? customNavigationDarkTheme
    : customNavigationLightTheme;

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      // Only read on mount: brings the user back to where they were if Android rebuilt the screen
      initialState={navigationStateMemory.get()}
      onStateChange={navigationStateMemory.set}
      onReady={notifyNavigationReady}
    >
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
