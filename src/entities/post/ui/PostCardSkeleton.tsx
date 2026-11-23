import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Row, Section, Skeleton, Stack } from '@/shared/ui';
import { ms, spacing } from '@/shared/theme';

const AVATAR_SIZE = ms(32);
const ICON_SIZE = ms(24);
const LINE_HEIGHT = ms(12);

// Gray stand-in for a PostCard while the first page loads; same spacing as the real card
export const PostCardSkeleton: React.FC = () => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Section>
        <Row gap="sm" style={styles.header}>
          <Skeleton width={AVATAR_SIZE} height={AVATAR_SIZE} circle />
          <Skeleton width={ms(120)} height={LINE_HEIGHT} />
        </Row>
      </Section>

      <Skeleton width={width} height={width} borderRadius={0} />

      <Section>
        <Row gap="lg" style={styles.actions}>
          <Skeleton width={ICON_SIZE} height={ICON_SIZE} borderRadius={ms(6)} />
          <Skeleton width={ICON_SIZE} height={ICON_SIZE} borderRadius={ms(6)} />
          <Skeleton width={ICON_SIZE} height={ICON_SIZE} borderRadius={ms(6)} />
        </Row>
        <Stack gap="xs">
          <Skeleton width={ms(90)} height={LINE_HEIGHT} />
          <Skeleton width="80%" height={LINE_HEIGHT} />
          <Skeleton width="45%" height={LINE_HEIGHT} />
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
