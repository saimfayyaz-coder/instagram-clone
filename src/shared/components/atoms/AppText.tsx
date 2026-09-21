import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

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
          fontWeight: theme.typography.fontWeights.bold,
          color: color || theme.colors.textPrimary,
        };
      case 'heading':
        return {
          fontSize: theme.typography.fontSizes.xxl,
          lineHeight: theme.typography.lineHeights.xxl,
          fontWeight: theme.typography.fontWeights.bold,
          color: color || theme.colors.textPrimary,
        };
      case 'subheading':
        return {
          fontSize: theme.typography.fontSizes.lg,
          lineHeight: theme.typography.lineHeights.lg,
          fontWeight: theme.typography.fontWeights.semibold,
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
          fontWeight: theme.typography.fontWeights.semibold,
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

  const getWeightStyle = () => {
    if (!weight) return null;
    return { fontWeight: theme.typography.fontWeights[weight] };
  };

  return (
    <RNText
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        styles.base,
        getVariantStyle(),
        getWeightStyle(),
        { textAlign: align },
        style,
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
