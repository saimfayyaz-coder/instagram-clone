import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/shared/types';
import { MAIN_ROUTES } from '@/shared/constants';

import { MainTabNavigator } from './MainTabNavigator';
import { SettingsPage } from '@/pages/main/settings';
import { ChatConversationPage } from '@/pages/main/chat';
import { EditProfilePage, UserProfilePage } from '@/pages/main/profile';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={MAIN_ROUTES.TABS} component={MainTabNavigator} />
      <Stack.Screen name={MAIN_ROUTES.SETTINGS} component={SettingsPage} />
      <Stack.Screen name={MAIN_ROUTES.CHAT_CONVERSATION} component={ChatConversationPage} />
      <Stack.Screen
        name={MAIN_ROUTES.EDIT_PROFILE}
        component={EditProfilePage}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name={MAIN_ROUTES.USER_PROFILE} component={UserProfilePage} />
    </Stack.Navigator>
  );
};
