import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { ListItem, Sheet, SheetContent } from '@/shared/ui';
import { APP_ICONS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface PostOptionsSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onDelete: () => void;
}

// Options for the user's own post
export const PostOptionsSheet: React.FC<PostOptionsSheetProps> = ({ bottomSheetRef, onDelete }) => {
  const { t } = useTranslation();

  const handleDelete = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    onDelete();
  }, [bottomSheetRef, onDelete]);

  return (
    <Sheet ref={bottomSheetRef as any} enableDynamicSizing enablePanDownToClose>
      <SheetContent style={styles.content}>
        <ListItem
          icon={APP_ICONS.TRASH}
          title={t(TRANSLATION_KEYS.POST_DELETE)}
          destructive
          onPress={handleDelete}
        />
      </SheetContent>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: ms(28),
  },
});
