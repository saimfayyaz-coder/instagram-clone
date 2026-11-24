import React, { memo, useCallback } from 'react';
import { Avatar, ListItem } from '@/shared/ui';
import { avatarSize } from '@/shared/theme';
import { UserSummary } from '../model/types';

export interface UserListItemProps {
  user: UserSummary;
  // Trailing content, e.g. a Follow button
  right?: React.ReactNode;
  onPress?: (user: UserSummary) => void;
  testID?: string;
}

export const UserListItem: React.FC<UserListItemProps> = memo(({ user, right, onPress, testID }) => {
  const handlePress = useCallback(() => onPress?.(user), [onPress, user]);

  return (
    <ListItem
      left={<Avatar uri={user.avatarUrl} size={avatarSize.listItem} />}
      title={user.username}
      subtitle={user.name || undefined}
      titleWeight="semibold"
      right={right}
      onPress={handlePress}
      testID={testID}
    />
  );
});

UserListItem.displayName = 'UserListItem';
