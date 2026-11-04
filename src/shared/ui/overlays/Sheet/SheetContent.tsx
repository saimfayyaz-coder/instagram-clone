import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '@/shared/hooks/useTheme';

export interface SheetContentProps {
  children: React.ReactNode;
  // Horizontal padding. Defaults to theme.layout.sheetGutter
  gutter?: number;
  style?: StyleProp<ViewStyle>;
}

// Static content of a Sheet with the standard sheet gutter. Must be the direct
// child of <Sheet> so dynamic sizing can measure it. For long lists use
// BottomSheetFlatList instead.
export const SheetContent: React.FC<SheetContentProps> = ({ children, gutter, style }) => {
  const { theme } = useTheme();
  return (
    <BottomSheetView style={[{ paddingHorizontal: gutter ?? theme.layout.sheetGutter }, style]}>
      {children}
    </BottomSheetView>
  );
};
