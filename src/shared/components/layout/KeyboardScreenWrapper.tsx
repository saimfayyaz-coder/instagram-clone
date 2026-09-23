import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAvoidingView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';
import { isIOS } from '@/shared/constants';

export interface KeyboardScreenWrapperProps
  extends Partial<Omit<KeyboardAwareScrollViewProps, 'style' | 'children'>> {
  children: React.ReactNode;
  scrollable?: boolean;
  dismissKeyboardOnTap?: boolean;
  bottomOffset?: number;
  stickyHeader?: React.ReactNode;
  stickyFooter?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const KeyboardScreenWrapper: React.FC<KeyboardScreenWrapperProps> = ({
  children,
  scrollable = true,
  dismissKeyboardOnTap = true,
  bottomOffset = 24,
  stickyHeader,
  stickyFooter,
  style,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  keyboardDismissMode = isIOS ? 'interactive' : 'on-drag',
  bounces = false,
  showsVerticalScrollIndicator = false,
  ...restProps
}) => {
  const content = (
    <>
      {scrollable ? (
        <KeyboardAwareScrollView
          style={styles.flexOne}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          bottomOffset={bottomOffset}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          keyboardDismissMode={keyboardDismissMode}
          bounces={bounces}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          {...restProps}
        >
          {dismissKeyboardOnTap ? (
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={styles.scrollWrapper}>{children}</View>
            </TouchableWithoutFeedback>
          ) : (
            children
          )}
        </KeyboardAwareScrollView>
      ) : (
        <KeyboardAvoidingView
          behavior={isIOS ? 'padding' : undefined}
          style={styles.flexOne}
        >
          {dismissKeyboardOnTap ? (
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={[styles.flexOne, contentContainerStyle]}>
                {children}
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <View style={[styles.flexOne, contentContainerStyle]}>
              {children}
            </View>
          )}
        </KeyboardAvoidingView>
      )}
    </>
  );

  return (
    <View style={[styles.container, style]}>
      {stickyHeader && <View style={styles.stickyHeader}>{stickyHeader}</View>}
      {content}
      {stickyFooter && <View style={styles.stickyFooter}>{stickyFooter}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollWrapper: {
    flexGrow: 1,
  },
  stickyHeader: {
    zIndex: 10,
  },
  stickyFooter: {
    zIndex: 10,
  },
});
