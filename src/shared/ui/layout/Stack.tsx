import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { Theme } from '@/shared/theme';

export type SpacingToken = keyof Theme['spacing'];

export interface StackProps extends ViewProps {
  // Space between children, as a spacing token
  gap?: SpacingToken;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: boolean;
}

const createStack = (direction: 'row' | 'column', defaultAlign?: ViewStyle['alignItems']) => {
  const StackComponent: React.FC<StackProps> = ({
    gap,
    align = defaultAlign,
    justify,
    wrap = false,
    style,
    children,
    ...props
  }) => {
    const { theme } = useTheme();
    return (
      <View
        style={[
          {
            flexDirection: direction,
            gap: gap ? theme.spacing[gap] : undefined,
            alignItems: align,
            justifyContent: justify,
            flexWrap: wrap ? 'wrap' : undefined,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  };
  return StackComponent;
};

// Vertical layout with token-based spacing between children.
export const Stack = createStack('column');

// Horizontal layout; children are vertically centered by default.
export const Row = createStack('row', 'center');
