import React, { useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Header, Screen } from '@/shared/ui';
import { UserSummary, useFollowList } from '@/entities/user';
import { UserListWidget } from '@/widgets/user-list';
import { APP_ICONS, FOLLOW_LIST_TYPES, MAIN_ROUTES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';

type FollowListRouteProp = RouteProp<MainStackParamList, typeof MAIN_ROUTES.FOLLOW_LIST>;

export const FollowListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { params } = useRoute<FollowListRouteProp>();
  const isFollowers = params.type === FOLLOW_LIST_TYPES.FOLLOWERS;

  const { users, isLoading, isError, isLoadingMore, loadMore, refetch } = useFollowList(
    params.userId,
    params.type,
  );

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  const handlePressUser = useCallback(
    (user: UserSummary) => {
      navigation.push(MAIN_ROUTES.USER_PROFILE, { userId: user.id, username: user.username });
    },
    [navigation],
  );

  return (
    <Screen
      header={
        <Header
          title={params.username}
          subtitle={t(
            isFollowers ? TRANSLATION_KEYS.PROFILE_FOLLOWERS : TRANSLATION_KEYS.PROFILE_FOLLOWING,
          )}
          onBack={handleGoBack}
        />
      }
    >
      <UserListWidget
        users={users}
        isLoading={isLoading}
        isError={isError}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        onRefresh={refetch}
        onRetry={refetch}
        onPressUser={handlePressUser}
        emptyIcon={APP_ICONS.PEOPLE}
        emptyTitle={t(
          isFollowers
            ? TRANSLATION_KEYS.PROFILE_FOLLOWERS_EMPTY
            : TRANSLATION_KEYS.PROFILE_FOLLOWING_EMPTY,
        )}
        errorTitle={t(TRANSLATION_KEYS.PROFILE_USERS_LOAD_FAILED)}
        retryLabel={t(TRANSLATION_KEYS.COMMON_TRY_AGAIN)}
      />
    </Screen>
  );
};
