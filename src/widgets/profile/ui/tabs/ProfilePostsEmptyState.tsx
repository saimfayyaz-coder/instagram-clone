import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/shared/ui';
import { APP_ICONS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface ProfilePostsEmptyStateProps {
  isCurrentUser: boolean;
  onShareFirstPhoto?: () => void;
}

export const ProfilePostsEmptyState: React.FC<ProfilePostsEmptyStateProps> = ({
  isCurrentUser,
  onShareFirstPhoto,
}) => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={APP_ICONS.CAMERA}
      title={t(TRANSLATION_KEYS.PROFILE_NO_POSTS_TITLE)}
      subtitle={t(TRANSLATION_KEYS.PROFILE_NO_POSTS_SUBTITLE)}
      actionLabel={isCurrentUser ? t(TRANSLATION_KEYS.PROFILE_SHARE_FIRST_PHOTO) : undefined}
      onAction={isCurrentUser ? onShareFirstPhoto : undefined}
    />
  );
};
