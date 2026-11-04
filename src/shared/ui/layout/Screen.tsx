import React from 'react';
import { View, ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles } from '@/shared/theme';
import { SCREEN_PRESETS, ScreenPreset } from '@/shared/constants';
import { KeyboardScroll, KeyboardScrollProps } from './KeyboardScroll';

export type { ScreenPreset };

export interface ScreenProps {
  children: React.ReactNode;
  // fixed: static content (lists manage their own scrolling)
  // scroll: content inside a ScrollView
  // form: keyboard-aware scroll for screens with inputs
  preset?: ScreenPreset;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  // Safe area edges handled by the screen. Defaults to none because the
  // Header owns the top inset; pass ['top'] for header-less screens.
  safeAreaEdges?: Edge[];
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  // Style of the content area (contentContainerStyle for scroll/form presets)
  contentStyle?: StyleProp<ViewStyle>;
  scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'children'>;
  keyboardProps?: Omit<KeyboardScrollProps, 'contentContainerStyle' | 'children'>;
  testID?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  preset = SCREEN_PRESETS.FIXED,
  header,
  footer,
  safeAreaEdges,
  backgroundColor,
  style,
  contentStyle,
  scrollProps,
  keyboardProps,
  testID,
}) => {
  const { theme } = useTheme();
  const rootStyle = [
    commonStyles.flex1,
    { backgroundColor: backgroundColor || theme.colors.bgPrimary },
    style,
  ];

  let content: React.ReactNode;
  if (preset === SCREEN_PRESETS.FORM) {
    content = (
      <KeyboardScroll contentContainerStyle={contentStyle} {...keyboardProps}>
        {children}
      </KeyboardScroll>
    );
  } else if (preset === SCREEN_PRESETS.SCROLL) {
    content = (
      <ScrollView
        style={commonStyles.flex1}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {children}
      </ScrollView>
    );
  } else {
    content = <View style={[commonStyles.flex1, contentStyle]}>{children}</View>;
  }

  const body = (
    <>
      {header}
      {content}
      {footer}
    </>
  );

  if (safeAreaEdges && safeAreaEdges.length > 0) {
    return (
      <SafeAreaView edges={safeAreaEdges} style={rootStyle} testID={testID}>
        {body}
      </SafeAreaView>
    );
  }

  return (
    <View style={rootStyle} testID={testID}>
      {body}
    </View>
  );
};
