import React, { useCallback, useMemo } from 'react';
import { Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header, headerActions, Screen } from '@/shared/ui';
import { useAppSelector } from '@/app/store/hooks';
import { useTranslation } from 'react-i18next';
import { selectCurrentUser, User } from '@/entities/user';
import { ProfileMainWidget } from '@/widgets/profile';
import { MAIN_ROUTES, HEADER_BACK_ICON } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';

type UserProfileRouteProp = RouteProp<MainStackParamList, typeof MAIN_ROUTES.USER_PROFILE>;

export const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<UserProfileRouteProp>();
  const currentUser = useAppSelector(selectCurrentUser);

  const { userId, username } = route.params || {};

  const isCurrentUser = Boolean(
    !userId ||
      (currentUser && (userId === currentUser.id || (currentUser as any)._id === userId)) ||
      (currentUser?.username && username === currentUser.username),
  );

  // If viewing self in stack, use currentUser. Otherwise construct or fetch target user
  const displayUser: User | null = useMemo(() => {
    if (isCurrentUser) {
      return currentUser;
    }
    return {
      id: userId || 'other-user',
      username: username || 'User',
      email: '',
    };
  }, [isCurrentUser, currentUser, userId, username]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToEditProfile = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.EDIT_PROFILE);
  }, [navigation]);

  const handleShareProfile = useCallback(async () => {
    const targetUsername = displayUser?.username;
    if (!targetUsername) return;
    try {
      await Share.share({
        message: `https://instagram.com/${targetUsername}`,
      });
    } catch {
      // Ignore cancellation
    }
  }, [displayUser?.username]);

  const handleMessage = useCallback(() => {
    if (displayUser?.username) {
      navigation.navigate(MAIN_ROUTES.CHAT_CONVERSATION, {
        username: displayUser.username,
      });
    }
  }, [displayUser?.username, navigation]);

  const rightActions = useMemo(() => {
    if (isCurrentUser) {
      return [
        headerActions.menu(() => navigation.navigate(MAIN_ROUTES.SETTINGS), {
          accessibilityLabel: 'Menu',
        }),
      ];
    }
    return [
      headerActions.menu(() => {}, {
        accessibilityLabel: 'Options',
      }),
    ];
  }, [isCurrentUser, navigation]);

  return (
    <Screen
      header={
        <Header
          onBack={handleGoBack}
          backIcon={HEADER_BACK_ICON.BACK}
          title={displayUser?.username || t(TRANSLATION_KEYS.PROFILE_TITLE)}
          rightActions={rightActions}
        />
      }
    >
      <ProfileMainWidget
        user={displayUser}
        isCurrentUser={isCurrentUser}
        onEditProfile={handleNavigateToEditProfile}
        onShareProfile={handleShareProfile}
        onMessage={handleMessage}
      />
    </Screen>
  );
};
