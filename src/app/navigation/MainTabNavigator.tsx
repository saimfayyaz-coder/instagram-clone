import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_ROUTES } from '@/shared/constants';
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
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.textPrimary,
        tabBarInactiveTintColor: theme.colors.textPrimary,
        tabBarButton: TabBarButton,
        tabBarStyle: {
          backgroundColor: theme.colors.bgPrimary,
          borderTopColor: theme.colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: ms(50) + (Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, ms(6))),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, ms(6)),
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name={TAB_ROUTES.FEED}
        component={FeedPage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              type="Ionicons"
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.SEARCH}
        component={SearchPage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              type="Ionicons"
              name={focused ? 'search' : 'search-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.CHAT}
        component={ChatPage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              type="Ionicons"
              name={focused ? 'paper-plane' : 'paper-plane-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TAB_ROUTES.PROFILE}
        component={ProfilePage}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              type="Ionicons"
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
