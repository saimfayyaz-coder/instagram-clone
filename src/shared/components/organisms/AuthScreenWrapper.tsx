import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { ResponsiveContainer } from '../layout/ResponsiveContainer';

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
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexOne}
      >
        <View style={styles.flexOne}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingVertical: theme.spacing.lg },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <ResponsiveContainer maxWidth={maxWidth} paddingHorizontal={theme.spacing.lg}>
              {header && <View style={styles.headerWrapper}>{header}</View>}
              <View style={styles.bodyWrapper}>{children}</View>
            </ResponsiveContainer>
          </ScrollView>

          {footer && (
            <ResponsiveContainer maxWidth={maxWidth} paddingHorizontal={theme.spacing.lg}>
              <View style={styles.footerWrapper}>{footer}</View>
            </ResponsiveContainer>
          )}
        </View>
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
    justifyContent: 'center',
  },
  headerWrapper: {
    width: '100%',
  },
  bodyWrapper: {
    width: '100%',
  },
  footerWrapper: {
    width: '100%',
  },
});
