import { lightColors, darkColors, ThemeColors } from './colors';
import { fontFamilies, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, borderRadius } from './spacing';
import { layout, Layout } from './layout';

export interface Theme {
  colors: ThemeColors;
  typography: {
    fontFamilies: typeof fontFamilies;
    fontSizes: typeof fontSizes;
    fontWeights: typeof fontWeights;
    lineHeights: typeof lineHeights;
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  layout: Layout;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  typography: { fontFamilies, fontSizes, fontWeights, lineHeights },
  spacing,
  borderRadius,
  layout,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography: { fontFamilies, fontSizes, fontWeights, lineHeights },
  spacing,
  borderRadius,
  layout,
  isDark: true,
};

export type ThemeMode = 'system' | 'light' | 'dark';
