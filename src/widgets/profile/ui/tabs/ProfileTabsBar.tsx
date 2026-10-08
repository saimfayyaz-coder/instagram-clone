import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import {
  APP_ICONS,
  ACCESSIBILITY_ROLES,
  PROFILE_TABS,
  ProfileTabType,
  AppIconName,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

interface TabItemConfig {
  id: ProfileTabType;
  icon: AppIconName;
  labelKey: string;
}

const TAB_ICON_SIZE = 23;

const PROFILE_TAB_ITEMS: readonly TabItemConfig[] = [
  {
    id: PROFILE_TABS.GRID,
    icon: APP_ICONS.GRID,
    labelKey: TRANSLATION_KEYS.PROFILE_TAB_POSTS,
  },
  {
    id: PROFILE_TABS.TAGGED,
    icon: APP_ICONS.TAGGED,
    labelKey: TRANSLATION_KEYS.PROFILE_TAB_TAGGED,
  },
];

export interface ProfileTabsBarProps {
  activeTab: ProfileTabType;
  onSelectTab: (tab: ProfileTabType) => void;
}

export const ProfileTabsBar: React.FC<ProfileTabsBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      accessibilityRole={ACCESSIBILITY_ROLES.TABLIST}
      style={[styles.container, { borderTopColor: theme.colors.border }]}
    >
      {PROFILE_TAB_ITEMS.map(({ id, icon, labelKey }) => {
        const isActive = activeTab === id;
        return (
          <TouchableOpacity
            key={id}
            onPress={() => onSelectTab(id)}
            activeOpacity={0.7}
            accessibilityRole={ACCESSIBILITY_ROLES.TAB}
            accessibilityLabel={t(labelKey)}
            accessibilityState={{ selected: isActive }}
            style={[
              styles.tabButton,
              isActive && {
                borderBottomColor: theme.colors.textPrimary,
                borderBottomWidth: ms(1.5),
              },
            ]}
          >
            <Icon
              type="Ionicons"
              name={icon}
              size={TAB_ICON_SIZE}
              color={isActive ? theme.colors.textPrimary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(20),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(10),
    borderBottomWidth: ms(1.5),
    borderBottomColor: 'transparent',
  },
});
