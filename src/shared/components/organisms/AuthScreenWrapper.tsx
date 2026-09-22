import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { ResponsiveContainer } from '../layout/ResponsiveContainer';

import { isIOS } from '../../constants';

export interface AuthScreenWrapperProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

export const AuthScreenWrapper: React.FC<AuthScreenWrapperProps> = ({
  children,
  header,
  footer,
  maxWidth = 440,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.bgPrimary },
      ]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={styles.flexOne}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <ResponsiveContainer
              maxWidth={maxWidth}
              paddingHorizontal={theme.spacing.lg}
              style={styles.flexOne}
              contentStyle={styles.responsiveContent}
            >
              <View style={[styles.mainBody, { paddingVertical: theme.spacing.lg }]}>
                {header && <View style={styles.headerWrapper}>{header}</View>}
                <View style={styles.bodyWrapper}>{children}</View>
              </View>

              {footer && (
                <View style={styles.footerWrapper}>{footer}</View>
              )}
            </ResponsiveContainer>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  responsiveContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  headerWrapper: {
    width: '100%',
  },
  bodyWrapper: {
    width: '100%',
  },
  footerWrapper: {
    width: '100%',
    paddingBottom: 8,
  },
});
