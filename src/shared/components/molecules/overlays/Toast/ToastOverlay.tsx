import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { hideToast } from '@/shared/lib/toast/toastSlice';
import { useTheme } from '@/shared/hooks';
import { commonStyles, palette } from '@/shared/theme';
import { ms } from '@/shared/theme/scaling';

export const ToastOverlay: React.FC = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { visible, message, duration, position } = useAppSelector(state => state.toast);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible && message) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          dispatch(hideToast());
        });
      }, duration || 3000);
    } else {
      opacity.setValue(0);
      translateY.setValue(20);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, message, duration, opacity, translateY, dispatch]);

  if (!visible && !message) {
    return null;
  }

  const isMiddle = position === 'middle';

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        commonStyles.center,
        isMiddle
          ? styles.middleContainer
          : { bottom: Math.max(insets.bottom + ms(16), ms(24)) },
      ]}
    >
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: theme.colors.toastBg,
            shadowColor: palette.black,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.toastText,
              fontWeight: theme.typography.fontWeights.medium,
            },
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  middleContainer: {
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: ms(20),
    paddingVertical: ms(12),
    borderRadius: ms(24),
    maxWidth: '85%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    fontSize: ms(13.5),
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
