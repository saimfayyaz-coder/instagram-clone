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
import { commonStyles } from '@/shared/theme';

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
          style={commonStyles.flex1}
          contentContainerStyle={[commonStyles.flexGrow1, contentContainerStyle]}
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
              <View style={commonStyles.flexGrow1}>{children}</View>
            </TouchableWithoutFeedback>
          ) : (
            children
          )}
        </KeyboardAwareScrollView>
      ) : (
        <KeyboardAvoidingView
          behavior={isIOS ? 'padding' : undefined}
          style={commonStyles.flex1}
        >
          {dismissKeyboardOnTap ? (
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={[commonStyles.flex1, contentContainerStyle]}>
                {children}
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <View style={[commonStyles.flex1, contentContainerStyle]}>
              {children}
            </View>
          )}
        </KeyboardAvoidingView>
      )}
    </>
  );

  return (
    <View style={[commonStyles.flex1, style]}>
      {stickyHeader && <View style={styles.stickyHeader}>{stickyHeader}</View>}
      {content}
      {stickyFooter && <View style={styles.stickyFooter}>{stickyFooter}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  stickyHeader: {
    zIndex: 10,
  },
  stickyFooter: {
    zIndex: 10,
  },
});
