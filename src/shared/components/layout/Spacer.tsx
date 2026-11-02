import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { SpacingToken } from './Stack';

export interface SpacerProps {
  size?: SpacingToken;
  horizontal?: boolean;
}

// Fixed empty space, sized by a spacing token.
export const Spacer: React.FC<SpacerProps> = ({ size = 'md', horizontal = false }) => {
  const { theme } = useTheme();
  const value = theme.spacing[size];
  return <View style={horizontal ? { width: value } : { height: value }} />;
};
