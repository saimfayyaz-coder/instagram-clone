import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import { Text } from '@/shared/ui/primitives/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerToast, ToastPayload } from '@/shared/lib/toast';
import { TOAST_POSITIONS } from '@/shared/constants';
import { useTheme } from '@/shared/hooks/useTheme';
import { commonStyles, palette } from '@/shared/theme';
import { ms } from '@/shared/theme/scaling';

export const ToastOverlay: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const visible = toast !== null;
  const message = toast?.message ?? '';
  const duration = toast?.duration ?? 3000;
  const position = toast?.position ?? TOAST_POSITIONS.BOTTOM;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    registerToast(setToast);
    return () => registerToast(null);
  }, []);

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
          setToast(null);
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
  }, [visible, message, duration, opacity, translateY]);

  if (!visible && !message) {
    return null;
  }

  const isMiddle = position === TOAST_POSITIONS.MIDDLE;

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
          variant="body"
          weight="medium"
          align="center"
          color={theme.colors.toastText}
          numberOfLines={2}
          style={styles.text}
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
    letterSpacing: -0.1,
  },
});
