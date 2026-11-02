import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';

export type TextVariant = 'hero' | 'heading' | 'subheading' | 'body' | 'caption' | 'link' | 'error';

export interface AppTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  variant = 'body',
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
      case 'hero':
        return {
          fontSize: theme.typography.fontSizes.hero,
          lineHeight: theme.typography.lineHeights.hero,
          color: color || theme.colors.textPrimary,
        };
      case 'heading':
        return {
          fontSize: theme.typography.fontSizes.xxl,
          lineHeight: theme.typography.lineHeights.xxl,
          color: color || theme.colors.textPrimary,
        };
      case 'subheading':
        return {
          fontSize: theme.typography.fontSizes.lg,
          lineHeight: theme.typography.lineHeights.lg,
          color: color || theme.colors.textPrimary,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSizes.sm,
          lineHeight: theme.typography.lineHeights.sm,
          color: color || theme.colors.textSecondary,
        };
      case 'link':
        return {
          fontSize: theme.typography.fontSizes.md,
          lineHeight: theme.typography.lineHeights.md,
          color: color || theme.colors.textLink,
        };
      case 'error':
        return {
          fontSize: theme.typography.fontSizes.sm,
          lineHeight: theme.typography.lineHeights.sm,
          color: color || theme.colors.error,
        };
      case 'body':
      default:
        return {
          fontSize: theme.typography.fontSizes.md,
          lineHeight: theme.typography.lineHeights.md,
          color: color || theme.colors.textPrimary,
        };
    }
  };

  const getFontFamily = () => {
    if (variant === 'hero') {
      return theme.typography.fontFamilies.headline;
    }
    const resolvedWeight =
      weight || (variant === 'heading' ? 'bold' : variant === 'subheading' ? 'semibold' : 'regular');
    switch (resolvedWeight) {
      case 'bold':
        return theme.typography.fontFamilies.bold;
      case 'semibold':
      case 'medium':
        return theme.typography.fontFamilies.medium;
      case 'regular':
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
