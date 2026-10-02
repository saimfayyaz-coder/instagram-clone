import React from 'react';
import { StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { AppAvatar, AvatarSize } from '@/shared/components/atoms';
import { useAppSelector } from '@/app/store';
import { User } from '../model/types';
import { selectCurrentUser, selectIsAvatarUpdating } from '../model/selectors';

export interface UserAvatarProps {
  user?: User | null;
  uri?: string | null;
  size?: AvatarSize;
  loading?: boolean;
  showEditBadge?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  testID?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  uri,
  loading: externalLoading = false,
  ...restProps
}) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const isGlobalAvatarUpdating = useAppSelector(selectIsAvatarUpdating);

  const isCurrentUserAvatar = Boolean(
    currentUser &&
      user &&
      ((user.id && user.id === currentUser.id) ||
        ((user as any)._id &&
          ((user as any)._id === (currentUser as any)._id ||
            (user as any)._id === currentUser.id)))
  );

  const isShimmering = externalLoading || (isCurrentUserAvatar && isGlobalAvatarUpdating);
  const resolvedUri = user ? (user.avatar?.url || user.avatarUrl || null) : uri;

  return (
    <AppAvatar
      uri={resolvedUri}
      loading={isShimmering}
      {...restProps}
    />
  );
};
