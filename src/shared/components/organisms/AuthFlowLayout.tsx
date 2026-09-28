import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppHeader, HeaderLeftIconType } from './AppHeader';
import { ResponsiveContainer, KeyboardScreenWrapper } from '../layout';
import { HEADER_LEFT_ICON_TYPE } from '@/shared/constants';
import { useTheme } from '../../hooks/useTheme';
import { commonStyles } from '@/shared/theme';
import { ms } from '@/shared/theme/scaling';

export interface AuthFlowLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  leftIconType?: HeaderLeftIconType;
  maxWidth?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const AuthFlowLayout: React.FC<AuthFlowLayoutProps> = ({
  children,
  onBack,
  leftIconType = HEADER_LEFT_ICON_TYPE.BACK,
  maxWidth = 440,
  contentContainerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[commonStyles.flex1, { backgroundColor: theme.colors.bgPrimary }]}>
      <AppHeader
        leftIconType={leftIconType}
        onPressBack={onBack}
        withSafeArea
      />

      <KeyboardScreenWrapper
        contentContainerStyle={[
          commonStyles.flexGrow1,
          styles.scrollContent,
          { paddingTop: theme.spacing.lg },
          contentContainerStyle,
        ]}
        bottomOffset={24}
      >
        <ResponsiveContainer maxWidth={maxWidth} paddingHorizontal={theme.spacing.lg}>
          {children}
        </ResponsiveContainer>
      </KeyboardScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: ms(32),
  },
});
