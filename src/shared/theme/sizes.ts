import { moderateScale } from './scaling';

// Design sizes for <Icon size>. Icon scales them itself, so pass them as they are
export const iconSize = {
  sm: 18,
  md: 22,
  tabBar: 23,
  lg: 26,
  // Double-tap heart over a post photo
  hero: 96,
} as const;

// Design sizes for <Avatar size>. Avatar scales them itself; wrap in ms() for a matching Skeleton
export const avatarSize = {
  xs: 24,
  sm: 32,
  listItem: 44,
  md: 56,
  lg: 86,
  xl: 100,
} as const;

// Scaled sizes for Views and Skeletons
export const sizes = {
  progressBar: moderateScale(2),
  dot: moderateScale(6),
  // Height of a gray text line in skeletons
  skeletonLine: moderateScale(12),
  skeletonIcon: moderateScale(24),
  badge: moderateScale(22),
  roundButton: moderateScale(32),
  thumbSm: moderateScale(40),
  thumbMd: moderateScale(44),
  thumbLg: moderateScale(64),
};

// Extra touch area around small buttons
export const hitSlop = {
  md: { top: 10, bottom: 10, left: 10, right: 10 },
  lg: { top: 12, bottom: 12, left: 12, right: 12 },
} as const;
