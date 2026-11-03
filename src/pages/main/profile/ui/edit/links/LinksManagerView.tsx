import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Touchable, Screen, Header, headerActions, ListItem, Text, Icon } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks';
import { useAppSelector } from '@/app/store/hooks';
import {
  selectCurrentUser,
  UserLink,
  MAX_PROFILE_LINKS,
} from '@/entities/user';
import {
  HEADER_BACK_ICON,
  APP_ICONS,
  ACCESSIBILITY_ROLES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { layout, ms } from '@/shared/theme';

export interface LinksManagerViewProps {
  onBack: () => void;
  onAddLink: () => void;
  onEditLink: (link: UserLink) => void;
}

export const LinksManagerView: React.FC<LinksManagerViewProps> = ({
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
      <ListItem
        icon={APP_ICONS.LINK}
        iconColor={theme.colors.textSecondary}
        title={item.title || item.url}
        subtitle={item.title ? item.url : undefined}
        titleWeight={item.title ? 'semibold' : 'regular'}
        onPress={() => onEditLink(item)}
        chevron
        divider
      />
    ),
    [onEditLink, theme.colors.textSecondary],
  );

  return (
    <Screen
      header={
        <Header
          onBack={onBack}
          backIcon={HEADER_BACK_ICON.BACK}
          title={t(TRANSLATION_KEYS.PROFILE_LINKS)}
          rightActions={rightActions}
        />
      }
    >
      {links.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Touchable
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
            <Text
              variant="body"
              weight="semibold"
              color={theme.colors.textPrimary}
            >
              {t(TRANSLATION_KEYS.PROFILE_ADD_LINK)}
            </Text>
          </Touchable>
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
    </Screen>
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
    paddingHorizontal: layout.gutter,
    paddingTop: ms(8),
  },
});
