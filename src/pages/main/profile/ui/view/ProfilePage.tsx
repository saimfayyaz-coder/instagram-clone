import React, { useCallback, useMemo } from 'react';
import { Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header, headerActions, Screen } from '@/shared/ui';
import { useAppSelector } from '@/app/store/hooks';
import { useTranslation } from 'react-i18next';
import { selectCurrentUser, useLazyGetCurrentUserQuery } from '@/entities/user';
import { ProfileMainWidget } from '@/widgets/profile';
import { Post } from '@/entities/post';
import { PostUploadBanner, selectIsPostUploadBusy } from '@/features/create-post';
import { showToast } from '@/shared/lib/toast';
import { FOLLOW_LIST_TYPES, FollowListType, MAIN_ROUTES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const currentUser = useAppSelector(selectCurrentUser);
  const isUploadBusy = useAppSelector(selectIsPostUploadBusy);
  const [loadCurrentUser] = useLazyGetCurrentUserQuery();

  const handleOpenSettings = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.SETTINGS);
  }, [navigation]);

  const handleNavigateToEditProfile = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.EDIT_PROFILE);
  }, [navigation]);

  const handleCreatePost = useCallback(() => {
    if (isUploadBusy) {
      showToast({ message: t(TRANSLATION_KEYS.CREATE_POST_UPLOAD_BUSY) });
      return;
    }
    navigation.navigate(MAIN_ROUTES.CREATE_POST_SELECT);
  }, [isUploadBusy, navigation, t]);

  const handlePressPost = useCallback(
    (post: Post) => {
      if (currentUser?.id) {
        navigation.navigate(MAIN_ROUTES.USER_POSTS_FEED, {
          userId: currentUser.id,
          postId: post.id,
        });
      }
    },
    [currentUser?.id, navigation],
  );

  const openFollowList = useCallback(
    (type: FollowListType) => {
      if (currentUser?.id) {
        navigation.navigate(MAIN_ROUTES.FOLLOW_LIST, {
          userId: currentUser.id,
          username: currentUser.username,
          type,
        });
      }
    },
    [currentUser?.id, currentUser?.username, navigation],
  );

  const handlePressFollowers = useCallback(
    () => openFollowList(FOLLOW_LIST_TYPES.FOLLOWERS),
    [openFollowList],
  );

  const handlePressFollowing = useCallback(
    () => openFollowList(FOLLOW_LIST_TYPES.FOLLOWING),
    [openFollowList],
  );

  // Follower counts change when other people follow, so pull to refresh reloads them
  const handleRefresh = useCallback(async () => {
    await loadCurrentUser();
  }, [loadCurrentUser]);

  const handleShareProfile = useCallback(async () => {
    const username = currentUser?.username;
    if (!username) return;
    try {
      await Share.share({
        message: `https://instagram.com/${username}`,
      });
    } catch {
      // Ignore share cancellation
    }
  }, [currentUser?.username]);

  const rightActions = useMemo(
    () => [
      headerActions.create(handleCreatePost, {
        accessibilityLabel: t(TRANSLATION_KEYS.CREATE_POST_TITLE),
      }),
      headerActions.menu(handleOpenSettings, {
        accessibilityLabel: t(TRANSLATION_KEYS.PROFILE_MENU),
      }),
    ],
    [handleCreatePost, handleOpenSettings, t],
  );

  return (
    <Screen
      header={
        <Header
          title={currentUser?.username || t(TRANSLATION_KEYS.PROFILE_TITLE)}
          rightActions={rightActions}
        />
      }
    >
      <PostUploadBanner />
      <ProfileMainWidget
        user={currentUser}
        isCurrentUser={true}
        onEditProfile={handleNavigateToEditProfile}
        onShareProfile={handleShareProfile}
        onPressPost={handlePressPost}
        onPressFollowers={handlePressFollowers}
        onPressFollowing={handlePressFollowing}
        onRefresh={handleRefresh}
        onShareFirstPhoto={handleCreatePost}
      />
    </Screen>
  );
};
