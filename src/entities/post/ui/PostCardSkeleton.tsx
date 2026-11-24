import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Row, Section, Skeleton, Stack } from '@/shared/ui';
import { avatarSize, ms, sizes, spacing } from '@/shared/theme';

// Gray stand-in for a PostCard while the first page loads; same spacing as the real card
export const PostCardSkeleton: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Section>
        <Row gap="sm" style={styles.header}>
          <Skeleton width={ms(avatarSize.sm)} height={ms(avatarSize.sm)} circle />
          <Skeleton width={ms(120)} height={sizes.skeletonLine} />
        </Row>
      </Section>

      <Skeleton width={width} height={width} borderRadius={0} />

      <Section>
        <Row gap="lg" style={styles.actions}>
          <Skeleton width={sizes.skeletonIcon} height={sizes.skeletonIcon} borderRadius={ms(6)} />
          <Skeleton width={sizes.skeletonIcon} height={sizes.skeletonIcon} borderRadius={ms(6)} />
          <Skeleton width={sizes.skeletonIcon} height={sizes.skeletonIcon} borderRadius={ms(6)} />
        </Row>
        <Stack gap="xs">
          <Skeleton width={ms(90)} height={sizes.skeletonLine} />
          <Skeleton width="80%" height={sizes.skeletonLine} />
          <Skeleton width="45%" height={sizes.skeletonLine} />
        </Stack>
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
  },
  header: {
    paddingVertical: spacing.sm,
  },
  actions: {
    paddingVertical: spacing.sm,
  },
});
