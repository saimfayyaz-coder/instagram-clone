export * from './colors';
export * from './typography';
export * from './spacing';
export * from './themeTokens';
export * from './navigationTheme';
export * from './scaling';

import { ms } from './scaling';
import { spacing, borderRadius } from './spacing';
import { fontSizes, fontWeights, lineHeights } from './typography';
import { palette, lightColors, darkColors } from './colors';

const R = {
  unit: {
    scale: (size: number) => ms(size),
  },
  spacing,
  borderRadius,
  typography: {
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
