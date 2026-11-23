import React, { useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Header, Screen } from '@/shared/ui';
import { useAppSelector } from '@/app/store/hooks';
import { selectCurrentUser } from '@/entities/user';
import { UserPostsFeedWidget } from '@/widgets/user-posts';
import { MAIN_ROUTES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';

type UserPostsFeedRouteProp = RouteProp<MainStackParamList, typeof MAIN_ROUTES.USER_POSTS_FEED>;

export const UserPostsFeedPage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<UserPostsFeedRouteProp>();
  const currentUser = useAppSelector(selectCurrentUser);

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Screen
      header={<Header title={t(TRANSLATION_KEYS.POST_POSTS_TITLE)} onBack={handleGoBack} />}
    >
      <UserPostsFeedWidget
        userId={params.userId}
        initialPostId={params.postId}
        isOwnPosts={params.userId === currentUser?.id}
        onDeleted={handleGoBack}
      />
    </Screen>
  );
};
