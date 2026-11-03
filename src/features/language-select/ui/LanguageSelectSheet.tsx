import React, { forwardRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, ListItem } from '@/shared/ui';
import { ms } from '@/shared/theme';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { changeLanguage, AVAILABLE_LANGUAGES } from '@/shared/lib/i18n';

import RNRestart from 'react-native-restart';

export interface LanguageSelectSheetProps {
  onLanguageSelected?: (langCode: string) => void;
  onClose?: () => void;
}

export const LanguageSelectSheet = forwardRef<BottomSheetModal, LanguageSelectSheetProps>(
  ({ onLanguageSelected, onClose }, ref) => {
    const { t, i18n } = useTranslation();

    const currentLang = i18n.language;

    const handleSelectLanguage = useCallback(
      (code: string) => {
        const rtlChanged = changeLanguage(code);
        onLanguageSelected?.(code);
        if (ref && 'current' in ref && ref.current) {
          ref.current.dismiss();
        }
        if (rtlChanged) {
          setTimeout(() => {
            RNRestart.restart();
          }, 150);
        }
      },
      [onLanguageSelected, ref]
    );

    return (
      <Sheet
        ref={ref}
        snapPoints={['45%', '65%']}
        onDismiss={onClose}
        showBackdrop
      >
        <SheetContent style={styles.content}>
          <SheetHeader title={t(TRANSLATION_KEYS.SETTINGS_SELECT_LANGUAGE)} />

          {AVAILABLE_LANGUAGES.map((lang) => (
            <ListItem
              key={lang.code}
              title={lang.nativeName}
              subtitle={lang.name !== lang.nativeName ? lang.name : undefined}
              selected={currentLang === lang.code || currentLang.startsWith(`${lang.code}-`)}
              onPress={() => handleSelectLanguage(lang.code)}
              divider
            />
          ))}
        </SheetContent>
      </Sheet>
    );
  }
);

LanguageSelectSheet.displayName = 'LanguageSelectSheet';

const styles = StyleSheet.create({
  content: {
    paddingBottom: ms(32),
  },
});
