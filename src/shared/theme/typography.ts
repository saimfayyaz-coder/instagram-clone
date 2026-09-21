import { moderateScale } from './scaling';

export const fontSizes = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  md: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  hero: moderateScale(32),
};

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  xs: moderateScale(14),
  sm: moderateScale(16),
  md: moderateScale(20),
  lg: moderateScale(22),
  xl: moderateScale(26),
  xxl: moderateScale(30),
  hero: moderateScale(38),
};
