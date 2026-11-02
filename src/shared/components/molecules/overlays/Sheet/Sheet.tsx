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

export interface SheetProps {
  children: React.ReactNode;
  // Omit to size the sheet to its content
  snapPoints?: (string | number)[];
  index?: number;
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  showBackdrop?: boolean;
  onDismiss?: () => void;
  onChange?: (index: number) => void;
  backgroundStyle?: StyleProp<ViewStyle>;
  handleIndicatorStyle?: StyleProp<ViewStyle>;
}

// Themed modal bottom sheet. Open/close it through a BottomSheetModal ref
// (ref.current?.present() / dismiss()). Wrap static content in SheetContent.
export const Sheet = forwardRef<BottomSheetModal, SheetProps>(
  (
    {
      children,
      snapPoints,
      index = 0,
      enableDynamicSizing,
      enablePanDownToClose = true,
      showBackdrop = true,
      onDismiss,
      onChange,
      backgroundStyle,
      handleIndicatorStyle,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const reducedMotion = useReducedMotion();

    const resolvedSnapPoints = useMemo(
      () => (snapPoints && snapPoints.length > 0 ? snapPoints : undefined),
      [snapPoints]
    );

    const isDynamicSizing = enableDynamicSizing ?? (resolvedSnapPoints === undefined);

    const handleDismiss = useCallback(() => {
      onDismiss?.();
    }, [onDismiss]);

    const handleChange = useCallback(
      (sheetIndex: number) => {
        onChange?.(sheetIndex);
      },
      [onChange]
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => {
        if (!showBackdrop) return null;
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
      [showBackdrop, theme.colors.backdropColor]
    );

    return (
      <BottomSheetModal
        ref={ref}
        {...(resolvedSnapPoints ? { snapPoints: resolvedSnapPoints } : {})}
        index={index}
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
          handleIndicatorStyle,
        ]}
        backgroundStyle={[
          styles.background,
          { backgroundColor: theme.colors.surface },
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

Sheet.displayName = 'Sheet';

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
