import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles } from '@/shared/theme';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  withSafeArea?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  header,
  withSafeArea = false,
  backgroundColor,
  style,
  contentStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const resolvedBg = backgroundColor || theme.colors.bgPrimary;

  const body = (
    <>
      {header}
      <View style={[commonStyles.flex1, contentStyle]}>
        {children}
      </View>
    </>
  );

  if (withSafeArea) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[commonStyles.flex1, { backgroundColor: resolvedBg }, style]}
        testID={testID}
      >
        {body}
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[commonStyles.flex1, { backgroundColor: resolvedBg }, style]}
      testID={testID}
    >
      {body}
    </View>
  );
};
