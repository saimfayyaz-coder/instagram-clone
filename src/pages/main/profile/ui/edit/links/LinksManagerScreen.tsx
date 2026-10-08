import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenWrapper } from '@/shared/components/layout';
import { AppHeader, headerActions } from '@/shared/components/organisms';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import {
  selectCurrentUser,
  UserLink,
  MAX_PROFILE_LINKS,
} from '@/entities/user';
import {
  HEADER_LEFT_ICON_TYPE,
  APP_ICONS,
  ACCESSIBILITY_ROLES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface LinksManagerScreenProps {
  onBack: () => void;
  onAddLink: () => void;
  onEditLink: (link: UserLink) => void;
}

export const LinksManagerScreen: React.FC<LinksManagerScreenProps> = ({
  onBack,
  onAddLink,
  onEditLink,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentUser = useAppSelector(selectCurrentUser);
  const links = currentUser?.links || [];

  const rightActions = useMemo(() => {
    if (links.length > 0 && links.length < MAX_PROFILE_LINKS) {
      return [
        headerActions.add(onAddLink, {
          color: theme.colors.textPrimary,
          accessibilityLabel: t(TRANSLATION_KEYS.PROFILE_ADD_LINK),
        }),
      ];
    }
    return [];
  }, [links.length, onAddLink, theme.colors.textPrimary, t]);

  const renderItem = useCallback(
    ({ item }: { item: UserLink }) => (
      <TouchableOpacity
        onPress={() => onEditLink(item)}
        activeOpacity={0.7}
        style={[
          styles.linkRow,
          {
            borderBottomColor: theme.colors.border,
          },
        ]}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        accessibilityLabel={item.title || item.url}
      >
        <Icon
          type="Ionicons"
          name={APP_ICONS.LINK}
          size={20}
          color={theme.colors.textSecondary}
          style={styles.linkIcon}
        />

        <View style={styles.linkTextContainer}>
          {Boolean(item.title) && (
            <AppText
              variant="body"
              weight="semibold"
              color={theme.colors.textPrimary}
              numberOfLines={1}
            >
              {item.title}
            </AppText>
          )}
          <AppText
            variant={item.title ? 'caption' : 'body'}
            color={item.title ? theme.colors.textSecondary : theme.colors.textPrimary}
            numberOfLines={1}
          >
            {item.url}
          </AppText>
        </View>

        <Icon
          type="Ionicons"
          name={APP_ICONS.CHEVRON_FORWARD}
          size={18}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
    ),
    [onEditLink, theme.colors],
  );

  return (
    <ScreenWrapper
      header={
        <AppHeader
          onPressBack={onBack}
          leftIconType={HEADER_LEFT_ICON_TYPE.BACK}
          title={t(TRANSLATION_KEYS.PROFILE_LINKS)}
          rightActions={rightActions}
        />
      }
    >
      {links.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TouchableOpacity
            onPress={onAddLink}
            activeOpacity={0.7}
            style={[
              styles.emptyAddButton,
              {
                borderColor: theme.colors.border,
              },
            ]}
            accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
            accessibilityLabel={t(TRANSLATION_KEYS.PROFILE_ADD_LINK)}
          >
            <Icon
              type="Ionicons"
              name={APP_ICONS.ADD}
              size={20}
              color={theme.colors.textPrimary}
              style={styles.emptyButtonIcon}
            />
            <AppText
              variant="body"
              weight="semibold"
              color={theme.colors.textPrimary}
            >
              {t(TRANSLATION_KEYS.PROFILE_ADD_LINK)}
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={links}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(20),
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
  },
  emptyButtonIcon: {
    marginRight: ms(8),
  },
  listContent: {
    paddingHorizontal: ms(16),
    paddingTop: ms(8),
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
  linkTextContainer: {
    flex: 1,
    marginRight: ms(12),
  },
});
