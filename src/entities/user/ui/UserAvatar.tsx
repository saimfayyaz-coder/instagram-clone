import React from 'react';
import { StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { Avatar, AvatarSize } from '@/shared/ui';
import { useAppSelector } from '@/app/store';
import { User } from '../model/types';
import {
  selectCurrentUser,
  selectIsAvatarUpdating,
  selectPendingAvatarUri,
} from '../model/selectors';

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
  const isAvatarUpdating = useAppSelector(selectIsAvatarUpdating);
  const pendingAvatarUri = useAppSelector(selectPendingAvatarUri);

  const isCurrentUserAvatar = Boolean(
    currentUser &&
      user &&
      ((user.id && user.id === currentUser.id) ||
        ((user as any)._id &&
          ((user as any)._id === (currentUser as any)._id ||
            (user as any)._id === currentUser.id)))
  );

  const savedUri = user ? (user.avatar?.url || user.avatarUrl || null) : uri;
  // Show the photo being uploaded right away instead of the old one
  const resolvedUri = (isCurrentUserAvatar && pendingAvatarUri) || savedUri;

  return (
    <Avatar
      uri={resolvedUri}
      loading={externalLoading}
      uploading={isCurrentUserAvatar && isAvatarUpdating}
      {...restProps}
    />
  );
};
