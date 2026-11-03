import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Sheet, SheetContent, SheetHeader, ListItem } from '@/shared/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { ms } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { GenderType, GENDER_OPTIONS } from '@/entities/user';

export interface GenderSelectSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  currentGender?: GenderType;
  onSelect: (gender: GenderType) => void;
}

export const GenderSelectSheet: React.FC<GenderSelectSheetProps> = ({
  bottomSheetRef,
  currentGender,
  onSelect,
}) => {
  const { t } = useTranslation();

  const handleSelect = useCallback(
    (gender: GenderType) => {
      onSelect(gender);
      bottomSheetRef.current?.dismiss();
    },
    [onSelect, bottomSheetRef],
  );

  return (
    <Sheet ref={bottomSheetRef as any} enableDynamicSizing>
      <SheetContent style={styles.sheetContainer}>
        <SheetHeader title={t(TRANSLATION_KEYS.PROFILE_GENDER)} />

        {GENDER_OPTIONS.map((opt) => (
          <ListItem
            key={opt.key}
            title={t(opt.labelKey)}
            selected={currentGender === opt.key}
            onPress={() => handleSelect(opt.key)}
          />
        ))}
      </SheetContent>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingBottom: ms(32),
  },
});
