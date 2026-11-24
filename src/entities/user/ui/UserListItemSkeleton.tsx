import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Skeleton } from '@/shared/ui';
import { avatarSize, layout, ms, spacing } from '@/shared/theme';

// Gray stand-in for a UserListItem while a people list loads
export const UserListItemSkeleton: React.FC = () => (
  <Row gap="md" style={styles.row}>
    <Skeleton width={ms(avatarSize.listItem)} height={ms(avatarSize.listItem)} circle />
    <View style={styles.text}>
      <Skeleton width="45%" height={ms(12)} />
      <Skeleton width="30%" height={ms(10)} />
    </View>
  </Row>
);

const styles = StyleSheet.create({
  row: {
    paddingVertical: layout.listItemVertical,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
});
