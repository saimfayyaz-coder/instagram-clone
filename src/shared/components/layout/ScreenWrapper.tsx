import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Screen } from './Screen';

// @deprecated Use <Screen> instead. Kept temporarily while screens migrate.
export interface ScreenWrapperProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  withSafeArea?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ withSafeArea = false, ...props }) => (
  <Screen safeAreaEdges={withSafeArea ? ['top'] : undefined} {...props} />
);
