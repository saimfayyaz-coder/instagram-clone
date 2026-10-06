import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_ROUTES, isIOS } from '@/shared/constants';
import { MainTabParamList } from '@/shared/types';
import { useTheme } from '@/shared/hooks';
import { Icon } from '@/shared/components/atoms';
import { ms } from '@/shared/theme';

import { PlatformPressable } from '@react-navigation/elements';

import { FeedPage } from '@/pages/main/feed';
import { SearchPage } from '@/pages/main/search';
import { ChatPage } from '@/pages/main/chat';
import { ProfilePage } from '@/pages/main/profile';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconConfig {
  active: string;
  inactive: string;
  size?: number;
}

const TAB_ICONS: Record<keyof MainTabParamList, TabIconConfig> = {
  [TAB_ROUTES.FEED]: { active: 'home', inactive: 'home-outline', size: 22 },
  [TAB_ROUTES.SEARCH]: { active: 'search', inactive: 'search-outline', size: 23 },
  [TAB_ROUTES.CHAT]: { active: 'paper-plane', inactive: 'paper-plane-outline', size: 23 },
  [TAB_ROUTES.PROFILE]: { active: 'person-circle', inactive: 'person-circle-outline', size: 23 },
};

const TabBarButton = (props: React.ComponentProps<typeof PlatformPressable>) => (
  <PlatformPressable
    {...props}
    android_ripple={{ color: 'transparent' }}
    pressColor="transparent"
    pressOpacity={1}
  />
);

export const MainTabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const iconConfig = TAB_ICONS[route.name as keyof MainTabParamList];

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.colors.textPrimary,
          tabBarInactiveTintColor: theme.colors.textPrimary,
          tabBarButton: TabBarButton,
          tabBarIcon: ({ focused, color }) => (
            <Icon
              type="Ionicons"
              name={focused ? iconConfig.active : iconConfig.inactive}
              size={iconConfig.size ?? 23}
              color={color}
            />
          ),
          tabBarStyle: {
            backgroundColor: theme.colors.bgPrimary,
            borderTopColor: theme.colors.border,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: ms(50) + (isIOS ? insets.bottom : Math.max(insets.bottom, ms(6))),
            paddingBottom: isIOS ? insets.bottom : Math.max(insets.bottom, ms(6)),
            elevation: 0,
          },
        };
      }}
    >
      <Tab.Screen name={TAB_ROUTES.FEED} component={FeedPage} />
      <Tab.Screen name={TAB_ROUTES.SEARCH} component={SearchPage} />
      <Tab.Screen name={TAB_ROUTES.CHAT} component={ChatPage} />
      <Tab.Screen name={TAB_ROUTES.PROFILE} component={ProfilePage} />
    </Tab.Navigator>
  );
};
