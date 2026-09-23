export const palette = {
  bluePrimary: '#0095F6',
  bluePressed: '#1877F2',
  blueDisabled: '#0095F680',
  redError: '#ED4956',
  greenSuccess: '#00BA88',
  white: '#FFFFFF',
  black: '#000000',
  facebookBlue: '#1877F2',
  transparent: 'transparent',
};

export const lightColors = {
  bgPrimary: '#FFFFFF',
  bgSecondary: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#DBDBDB',
  borderFocus: palette.bluePrimary,
  textPrimary: '#262626',
  textSecondary: '#737373',
  textLink: palette.bluePrimary,
  actionPrimary: palette.bluePrimary,
  actionPrimaryDisabled: '#B2DFFC',
  actionSecondaryText: palette.facebookBlue,
  error: palette.redError,
  success: palette.greenSuccess,
  divider: '#DBDBDB',
};

export const darkColors = {
  bgPrimary: '#000000',
  bgSecondary: '#121212',
  surface: '#121212',
  border: '#262626',
  borderFocus: palette.bluePrimary,
  textPrimary: '#F5F5F5',
  textSecondary: '#A8A8A8',
  textLink: '#3797EF',
  actionPrimary: palette.bluePrimary,
  actionPrimaryDisabled: '#002D4A',
  actionSecondaryText: palette.facebookBlue,
  error: palette.redError,
  success: palette.greenSuccess,
  divider: '#262626',
};

export type ThemeColors = typeof lightColors;
