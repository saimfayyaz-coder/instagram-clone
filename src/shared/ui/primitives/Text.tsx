import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { TEXT_VARIANTS, TEXT_WEIGHTS, TextVariant, TextWeight } from '@/shared/constants';

export type { TextVariant, TextWeight };

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: TextWeight;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = TEXT_VARIANTS.BODY,
  color,
  weight,
  align = 'auto',
  style,
  maxFontSizeMultiplier = 1.3,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case TEXT_VARIANTS.HERO:
        return {
          fontSize: theme.typography.fontSizes.hero,
          lineHeight: theme.typography.lineHeights.hero,
          color: color || theme.colors.textPrimary,
        };
      case TEXT_VARIANTS.HEADING:
        return {
          fontSize: theme.typography.fontSizes.xxl,
          lineHeight: theme.typography.lineHeights.xxl,
          color: color || theme.colors.textPrimary,
        };
      case TEXT_VARIANTS.SUBHEADING:
        return {
          fontSize: theme.typography.fontSizes.lg,
          lineHeight: theme.typography.lineHeights.lg,
          color: color || theme.colors.textPrimary,
        };
      case TEXT_VARIANTS.CAPTION:
        return {
          fontSize: theme.typography.fontSizes.sm,
          lineHeight: theme.typography.lineHeights.sm,
          color: color || theme.colors.textSecondary,
        };
      case TEXT_VARIANTS.LINK:
        return {
          fontSize: theme.typography.fontSizes.md,
          lineHeight: theme.typography.lineHeights.md,
          color: color || theme.colors.textLink,
        };
      case TEXT_VARIANTS.ERROR:
        return {
          fontSize: theme.typography.fontSizes.sm,
          lineHeight: theme.typography.lineHeights.sm,
          color: color || theme.colors.error,
        };
      case TEXT_VARIANTS.BODY:
      default:
        return {
          fontSize: theme.typography.fontSizes.md,
          lineHeight: theme.typography.lineHeights.md,
          color: color || theme.colors.textPrimary,
        };
    }
  };

  const getFontFamily = () => {
    if (variant === TEXT_VARIANTS.HERO) {
      return theme.typography.fontFamilies.headline;
    }
    const resolvedWeight =
      weight ||
      (variant === TEXT_VARIANTS.HEADING
        ? TEXT_WEIGHTS.BOLD
        : variant === TEXT_VARIANTS.SUBHEADING
          ? TEXT_WEIGHTS.SEMIBOLD
          : TEXT_WEIGHTS.REGULAR);
    switch (resolvedWeight) {
      case TEXT_WEIGHTS.BOLD:
        return theme.typography.fontFamilies.bold;
      case TEXT_WEIGHTS.SEMIBOLD:
      case TEXT_WEIGHTS.MEDIUM:
        return theme.typography.fontFamilies.medium;
      case TEXT_WEIGHTS.REGULAR:
      default:
        return theme.typography.fontFamilies.regular;
    }
  };

  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        styles.base,
        getVariantStyle(),
        { textAlign: align },
        style,
        {
          fontFamily: getFontFamily(),
          fontWeight: undefined,
        },
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
