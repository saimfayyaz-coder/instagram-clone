import React from 'react';
import { StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { Avatar, AvatarSize } from '@/shared/ui';
import { useAppSelector } from '@/app/store';
import { User } from '../model/types';
import { selectIsAvatarUpdating } from '../model/selectors';
import { useUserAvatarUri } from '../model/useUserAvatarUri';

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
  const isAvatarUpdating = useAppSelector(selectIsAvatarUpdating);
  // Shows the photo being uploaded right away instead of the old one
  const { uri: resolvedUri, isCurrentUser } = useUserAvatarUri(user, uri);

  return (
    <Avatar
      uri={resolvedUri}
      loading={externalLoading}
      uploading={isCurrentUser && isAvatarUpdating}
      {...restProps}
    />
  );
};
