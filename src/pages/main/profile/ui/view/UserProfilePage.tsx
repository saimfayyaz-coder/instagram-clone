import React, { useCallback, useMemo } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { EmptyState, Header, headerActions, Screen } from '@/shared/ui';
import { useAppSelector } from '@/app/store/hooks';
import { selectCurrentUser, useGetPublicProfileQuery } from '@/entities/user';
import { useFollowToggle } from '@/features/follow-user';
import { ProfileHeaderSkeleton, ProfileMainWidget } from '@/widgets/profile';
import { Post, PostGridSkeleton } from '@/entities/post';
import {
  APP_ICONS,
  FOLLOW_LIST_TYPES,
  FollowListType,
  HEADER_BACK_ICON,
  MAIN_ROUTES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';

type UserProfileRouteProp = RouteProp<MainStackParamList, typeof MAIN_ROUTES.USER_PROFILE>;

// Someone else's profile, opened from search or a followers list
export const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { params } = useRoute<UserProfileRouteProp>();
  const currentUser = useAppSelector(selectCurrentUser);
  const { toggleFollow } = useFollowToggle();

  const isCurrentUser =
    Boolean(currentUser) &&
    (params.userId === currentUser?.id || params.username === currentUser?.username);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useGetPublicProfileQuery(params.username, { skip: isCurrentUser });

  const user = isCurrentUser ? currentUser : profile;

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleOpenSettings = useCallback(
    () => navigation.navigate(MAIN_ROUTES.SETTINGS),
    [navigation],
  );

  const handleNavigateToEditProfile = useCallback(
    () => navigation.navigate(MAIN_ROUTES.EDIT_PROFILE),
    [navigation],
  );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleShareProfile = useCallback(async () => {
    try {
      await Share.share({ message: `https://instagram.com/${params.username}` });
    } catch {
      // Ignore share cancellation
    }
  }, [params.username]);

  const handleFollowToggle = useCallback(() => {
    if (profile) toggleFollow(profile);
  }, [profile, toggleFollow]);

  const openFollowList = useCallback(
    (type: FollowListType) => {
      if (user?.id) {
        navigation.push(MAIN_ROUTES.FOLLOW_LIST, { userId: user.id, username: user.username, type });
      }
    },
    [navigation, user?.id, user?.username],
  );

  const handlePressFollowers = useCallback(
    () => openFollowList(FOLLOW_LIST_TYPES.FOLLOWERS),
    [openFollowList],
  );

  const handlePressFollowing = useCallback(
    () => openFollowList(FOLLOW_LIST_TYPES.FOLLOWING),
    [openFollowList],
  );

  const handlePressPost = useCallback(
    (post: Post) => {
      if (user?.id) {
        navigation.navigate(MAIN_ROUTES.USER_POSTS_FEED, { userId: user.id, postId: post.id });
      }
    },
    [navigation, user?.id],
  );

  const handleMessage = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.CHAT_CONVERSATION, { username: params.username });
  }, [navigation, params.username]);

  const rightActions = useMemo(
    () =>
      isCurrentUser
        ? [
            headerActions.menu(handleOpenSettings, {
              accessibilityLabel: t(TRANSLATION_KEYS.PROFILE_MENU),
            }),
          ]
        : undefined,
    [handleOpenSettings, isCurrentUser, t],
  );

  const renderContent = () => {
    if (!isCurrentUser && isLoading) {
      return (
        <View style={styles.skeleton}>
          <ProfileHeaderSkeleton />
          <PostGridSkeleton />
        </View>
      );
    }
    if (!user || (!isCurrentUser && isError)) {
      return (
        <EmptyState
          icon={APP_ICONS.PERSON_CIRCLE}
          title={t(TRANSLATION_KEYS.PROFILE_LOAD_FAILED)}
          actionLabel={t(TRANSLATION_KEYS.COMMON_TRY_AGAIN)}
          onAction={refetch}
          style={styles.error}
        />
      );
    }
    return (
      <ProfileMainWidget
        user={user}
        isCurrentUser={isCurrentUser}
        isFollowing={profile?.isFollowing}
        onEditProfile={handleNavigateToEditProfile}
        onShareProfile={handleShareProfile}
        onFollowToggle={isCurrentUser ? undefined : handleFollowToggle}
        onMessage={handleMessage}
        onPressFollowers={handlePressFollowers}
        onPressFollowing={handlePressFollowing}
        onPressPost={handlePressPost}
        onRefresh={isCurrentUser ? undefined : handleRefresh}
      />
    );
  };

  return (
    <Screen
      header={
        <Header
          onBack={handleGoBack}
          backIcon={HEADER_BACK_ICON.BACK}
          title={params.username}
          rightActions={rightActions}
        />
      }
    >
      {renderContent()}
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: {
    flex: 1,
  },
  skeleton: {
    flex: 1,
    overflow: 'hidden',
  },
});
