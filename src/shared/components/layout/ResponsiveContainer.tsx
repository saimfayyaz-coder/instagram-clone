import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { Container } from './Container';
import { layout } from '@/shared/theme';

// @deprecated Use <Container> instead. Kept temporarily while screens migrate.
export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  paddingHorizontal?: number;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  maxWidth = layout.authMaxWidth,
  paddingHorizontal,
  ...props
}) => <Container maxWidth={maxWidth} gutter={paddingHorizontal} {...props} />;
