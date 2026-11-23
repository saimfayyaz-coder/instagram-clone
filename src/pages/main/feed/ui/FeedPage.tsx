import React, { useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InstagramLogo, Header, headerActions, Screen } from '@/shared/ui';
import { LOGO_VARIANTS, MAIN_ROUTES, TAB_ROUTES } from '@/shared/constants';
import { MainStackParamList } from '@/shared/types';
import { Post } from '@/entities/post';
import { FeedWidget } from '@/widgets/feed';
import { PostUploadBanner } from '@/features/create-post';

export const FeedPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleNotifications = useCallback(() => {
    // Notifications action
  }, []);

  const handlePressAuthor = useCallback(
    (post: Post) => {
      navigation.navigate(MAIN_ROUTES.USER_PROFILE, {
        userId: post.author.id,
        username: post.author.username,
      });
    },
    [navigation],
  );

  const handleFindPeople = useCallback(() => {
    navigation.navigate(MAIN_ROUTES.TABS, { screen: TAB_ROUTES.SEARCH });
  }, [navigation]);

  const titleComponent = useMemo(
    () => <InstagramLogo variant={LOGO_VARIANTS.WORDMARK} size={26} />,
    [],
  );

  const rightActions = useMemo(
    () => [headerActions.notifications(handleNotifications)],
    [handleNotifications],
  );

  const header = useMemo(
    () => (
      <Header
        center={titleComponent}
        rightActions={rightActions}
      />
    ),
    [titleComponent, rightActions],
  );

  return (
    <Screen header={header}>
      <PostUploadBanner />
      <FeedWidget onPressAuthor={handlePressAuthor} onFindPeople={handleFindPeople} />
    </Screen>
  );
};
