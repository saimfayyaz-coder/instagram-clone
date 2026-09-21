import { lightColors, darkColors, ThemeColors } from './colors';
import { fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, borderRadius } from './spacing';

export interface Theme {
  colors: ThemeColors;
  typography: {
    fontSizes: typeof fontSizes;
    fontWeights: typeof fontWeights;
    lineHeights: typeof lineHeights;
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  typography: { fontSizes, fontWeights, lineHeights },
  spacing,
  borderRadius,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography: { fontSizes, fontWeights, lineHeights },
  spacing,
  borderRadius,
  isDark: true,
};

export type ThemeMode = 'system' | 'light' | 'dark';
