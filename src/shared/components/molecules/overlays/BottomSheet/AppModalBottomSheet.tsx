import React, { forwardRef, useMemo, useCallback } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetBackdropProps,
  ANIMATION_CONFIGS,
} from '@gorhom/bottom-sheet';
import { useReducedMotion, ReduceMotion } from 'react-native-reanimated';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme';

export interface AppModalBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  customSnapPoints?: (string | number)[];
  initialIndex?: number;
  index?: number;
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  showBackdrop?: boolean;
  showBackDrop?: boolean;
  onDismiss?: () => void;
  onSheetClosed?: () => void;
  onChange?: (index: number) => void;
  onChangeSheet?: (index: number) => void;
  customBottomSheetStyle?: StyleProp<ViewStyle>;
  customBottomSheetIndicatorStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
}

export const AppModalBottomSheet = forwardRef<BottomSheetModal, AppModalBottomSheetProps>(
  (
    {
      children,
      snapPoints,
      customSnapPoints,
      initialIndex,
      index = 0,
      enableDynamicSizing,
      enablePanDownToClose = true,
      showBackdrop = true,
      showBackDrop,
      onDismiss,
      onSheetClosed,
      onChange,
      onChangeSheet,
      customBottomSheetStyle,
      customBottomSheetIndicatorStyle,
      backgroundStyle,
      handleIndicatorStyle,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const reducedMotion = useReducedMotion();

    const resolvedSnapPoints = useMemo(() => {
      const points = customSnapPoints || snapPoints;
      if (points && points.length > 0) {
        return points;
      }
      return undefined;
    }, [customSnapPoints, snapPoints]);

    const isDynamicSizing = enableDynamicSizing ?? (resolvedSnapPoints === undefined);
    const isBackdropVisible = showBackDrop ?? showBackdrop;

    const handleDismiss = useCallback(() => {
      onDismiss?.();
      onSheetClosed?.();
    }, [onDismiss, onSheetClosed]);

    const handleChange = useCallback(
      (sheetIndex: number) => {
        onChange?.(sheetIndex);
        onChangeSheet?.(sheetIndex);
      },
      [onChange, onChangeSheet]
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => {
        if (!isBackdropVisible) return null;
        return (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            enableTouchThrough={false}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[
              { backgroundColor: theme.colors.backdropColor },
              StyleSheet.absoluteFill,
            ]}
          />
        );
      },
      [isBackdropVisible, theme.colors.backdropColor]
    );

    return (
      <BottomSheetModal
        ref={ref}
        {...(resolvedSnapPoints ? { snapPoints: resolvedSnapPoints } : {})}
        index={initialIndex ?? index}
        animateOnMount={!reducedMotion}
        animationConfigs={{
          ...ANIMATION_CONFIGS,
          reduceMotion: ReduceMotion.Never,
        }}
        enableDismissOnClose
        enableDynamicSizing={isDynamicSizing}
        enablePanDownToClose={enablePanDownToClose}
        handleIndicatorStyle={[
          styles.handleBar,
          { backgroundColor: theme.colors.bottomSheetHandleBar },
          customBottomSheetIndicatorStyle,
          handleIndicatorStyle,
        ]}
        backgroundStyle={[
          styles.background,
          { backgroundColor: theme.colors.surface },
          customBottomSheetStyle,
          backgroundStyle,
        ]}
        onChange={handleChange}
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
      >
        {children}
      </BottomSheetModal>
    );
  }
);

AppModalBottomSheet.displayName = 'AppModalBottomSheet';

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  handleBar: {
    width: ms(36),
    height: ms(4),
    borderRadius: ms(2),
    marginTop: ms(8),
  },
});
