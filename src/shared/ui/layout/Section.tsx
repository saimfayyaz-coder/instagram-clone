import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';

export interface SectionProps extends ViewProps {
  // Horizontal padding. Defaults to theme.layout.gutter
  gutter?: number;
}

// A block of screen content with the standard horizontal gutter.
// Leave full-bleed parts (tab bars, grids, dividers) outside a Section.
export const Section: React.FC<SectionProps> = ({ gutter, style, children, ...props }) => {
  const { theme } = useTheme();

  return (
    <View style={[{ paddingHorizontal: gutter ?? theme.layout.gutter }, style]} {...props}>
      {children}
    </View>
  );
};
