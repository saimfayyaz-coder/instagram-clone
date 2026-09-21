import { moderateScale } from './scaling';

export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(24),
  xxl: moderateScale(32),
  hero: moderateScale(48),
};

export const borderRadius = {
  xs: moderateScale(3),
  sm: moderateScale(5),
  md: moderateScale(8),
  lg: moderateScale(12),
  full: 9999,
};
