import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Sheet, SheetHeader, Section, ListItem, Icon } from '@/shared/ui';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks';
import { UserLink } from '@/entities/user';
import { APP_ICONS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { formatDisplayUrl } from '@/shared/lib/formatters';
import { ms } from '@/shared/theme';

export interface ProfileLinksSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  links: UserLink[];
  onSelectLink: (url: string) => void;
}

export const ProfileLinksSheet: React.FC<ProfileLinksSheetProps> = ({
  bottomSheetRef,
  links,
  onSelectLink,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleDismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  const handleLinkPress = useCallback(
    (url: string) => {
      handleDismiss();
      onSelectLink(url);
    },
    [handleDismiss, onSelectLink],
  );

  return (
    <Sheet
      ref={bottomSheetRef as any}
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView style={styles.sheetContainer}>
        <SheetHeader title={t(TRANSLATION_KEYS.PROFILE_LINKS)} />

        <Section>
          {links.map((link) => (
            <ListItem
              key={link._id}
              icon={APP_ICONS.LINK}
              iconColor={theme.colors.textSecondary}
              title={link.title || formatDisplayUrl(link.url)}
              subtitle={link.title ? formatDisplayUrl(link.url) : undefined}
              titleWeight={link.title ? 'semibold' : 'regular'}
              accessibilityLabel={link.title || link.url}
              onPress={() => handleLinkPress(link.url)}
              divider
              right={
                <Icon
                  type="Ionicons"
                  name={APP_ICONS.OPEN_OUTLINE}
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
            />
          ))}
        </Section>
      </BottomSheetView>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingBottom: ms(28),
  },
});
