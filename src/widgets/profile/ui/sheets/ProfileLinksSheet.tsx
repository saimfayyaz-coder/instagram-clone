import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Touchable, Sheet, Text, Icon } from '@/shared/ui';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks';
import { UserLink } from '@/entities/user';
import { APP_ICONS, ACCESSIBILITY_ROLES } from '@/shared/constants';
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
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text variant="body" weight="bold" color={theme.colors.textPrimary}>
            {t(TRANSLATION_KEYS.PROFILE_LINKS)}
          </Text>
        </View>

        <View style={styles.linksList}>
          {links.map((link) => (
            <Touchable
              key={link._id}
              style={[styles.linkRow, { borderBottomColor: theme.colors.border }]}
              onPress={() => handleLinkPress(link.url)}
              activeOpacity={0.7}
              accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
              accessibilityLabel={link.title || link.url}
            >
              <Icon
                type="Ionicons"
                name={APP_ICONS.LINK}
                size={20}
                color={theme.colors.textSecondary}
                style={styles.linkIcon}
              />
              <View style={styles.linkInfo}>
                {Boolean(link.title) && (
                  <Text
                    variant="body"
                    weight="semibold"
                    color={theme.colors.textPrimary}
                    numberOfLines={1}
                  >
                    {link.title}
                  </Text>
                )}
                <Text
                  variant={link.title ? 'caption' : 'body'}
                  color={link.title ? theme.colors.textSecondary : theme.colors.textPrimary}
                  numberOfLines={1}
                >
                  {formatDisplayUrl(link.url)}
                </Text>
              </View>
              <Icon
                type="Ionicons"
                name={APP_ICONS.OPEN_OUTLINE}
                size={16}
                color={theme.colors.textSecondary}
              />
            </Touchable>
          ))}
        </View>
      </BottomSheetView>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    paddingBottom: ms(28),
  },
  header: {
    paddingVertical: ms(14),
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  linksList: {
    paddingHorizontal: ms(16),
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  linkIcon: {
    marginRight: ms(12),
  },
  linkInfo: {
    flex: 1,
    marginRight: ms(8),
  },
});
