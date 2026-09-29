export * from './colors';
export * from './typography';
export * from './spacing';
export * from './themeTokens';
export * from './navigationTheme';
export * from './scaling';
export * from './commonStyles';
export * from './authStepStyles';

import { ms } from './scaling';
import { spacing, borderRadius } from './spacing';
import { fontFamilies, fontSizes, fontWeights, lineHeights } from './typography';
import { palette, lightColors, darkColors } from './colors';

const R = {
  unit: {
    scale: (size: number) => ms(size),
  },
  spacing,
  borderRadius,
  typography: {
    fontFamilies,
    fontSizes,
    fontWeights,
    lineHeights,
  },
  colors: {
    palette,
    light: lightColors,
    dark: darkColors,
  },
};

export default R;
export { R };
