import { moderateScale as rnModerateScale } from 'react-native-size-matters';

export const DEFAULT_SCALE_FACTOR = 0.3;

export const moderateScale = (
  size: number,
  factor: number = DEFAULT_SCALE_FACTOR,
): number => rnModerateScale(size, factor);

export const ms = moderateScale;
