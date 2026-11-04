import React, { forwardRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, ListItem } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { ms } from '@/shared/theme';
import { TEST_IDS, ThemeMode } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { THEME_MODE_OPTIONS } from '../model/themeModeOptions';

export const ThemeSelectSheet = forwardRef<BottomSheetModal>((_props, ref) => {
  const { t } = useTranslation();
  const { mode, setMode } = useTheme();

  const handleSelect = useCallback(
    (nextMode: ThemeMode) => {
      setMode(nextMode);
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
    },
    [setMode, ref],
  );

  return (
    <Sheet ref={ref} enableDynamicSizing enablePanDownToClose>
      <SheetContent style={styles.content}>
        <SheetHeader title={t(TRANSLATION_KEYS.SETTINGS_THEME)} />

        {THEME_MODE_OPTIONS.map((option) => (
          <ListItem
            key={option.mode}
            title={t(option.labelKey)}
            selected={mode === option.mode}
            onPress={() => handleSelect(option.mode)}
            testID={`${TEST_IDS.SETTINGS.THEME_OPTION}-${option.mode}`}
          />
        ))}
      </SheetContent>
    </Sheet>
  );
});

ThemeSelectSheet.displayName = 'ThemeSelectSheet';

const styles = StyleSheet.create({
  content: {
    paddingBottom: ms(32),
  },
});
