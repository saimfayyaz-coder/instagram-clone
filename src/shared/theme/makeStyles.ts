import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { Theme } from './themeTokens';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

// Creates a hook that returns theme-aware styles, memoized per theme.
//
//   const useStyles = makeStyles(theme => ({
//     container: { backgroundColor: theme.colors.bgPrimary },
//   }));
//   const styles = useStyles();
export const makeStyles =
  <T extends NamedStyles<T>>(factory: (theme: Theme) => T) =>
  (): T => {
    const { theme } = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
