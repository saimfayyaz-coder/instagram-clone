import { Theme as NavigationTheme, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { lightTheme, darkTheme } from './themeTokens';

export const customNavigationLightTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightTheme.colors.actionPrimary,
    background: lightTheme.colors.bgPrimary,
    card: lightTheme.colors.surface,
    text: lightTheme.colors.textPrimary,
    border: lightTheme.colors.border,
    notification: lightTheme.colors.error,
  },
};

export const customNavigationDarkTheme: NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkTheme.colors.actionPrimary,
    background: darkTheme.colors.bgPrimary,
    card: darkTheme.colors.surface,
    text: darkTheme.colors.textPrimary,
    border: darkTheme.colors.border,
    notification: darkTheme.colors.error,
  },
};
