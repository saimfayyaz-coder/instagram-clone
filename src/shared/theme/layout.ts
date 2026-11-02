import { moderateScale } from './scaling';
import { spacing } from './spacing';

// Screen-level layout tokens. Screens and sections read gutters from here
// instead of hard-coding padding values.
export const layout = {
  // Horizontal padding of screen content (sections, forms, containers)
  gutter: spacing.lg,
  // Horizontal padding inside bottom sheets (applied by SheetContent)
  sheetGutter: moderateScale(20),
  // Horizontal padding of the app header bar
  headerHorizontal: moderateScale(16),
  // Bottom breathing room at the end of scrollable screens
  screenBottom: moderateScale(40),
  // Bottom padding of auth step screens (signup, otp, forgot/reset password)
  authStepBottom: moderateScale(32),
  // Max content width of auth screens (keeps forms readable on tablets)
  authMaxWidth: 440,
};

export type Layout = typeof layout;
