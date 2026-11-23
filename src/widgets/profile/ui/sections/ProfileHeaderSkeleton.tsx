import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Section, Skeleton, Stack } from '@/shared/ui';
import { commonStyles, ms } from '@/shared/theme';

const AVATAR_SIZE = ms(78);
const LINE_HEIGHT = ms(12);
const BUTTON_HEIGHT = ms(32);
const STAT_COUNT = 3;

// Gray stand-in for the profile header, bio and buttons while a profile loads
export const ProfileHeaderSkeleton: React.FC = () => (
  <View>
    <Section style={styles.header}>
      <Row>
        <Skeleton width={AVATAR_SIZE} height={AVATAR_SIZE} circle />
        <View style={[commonStyles.flex1, styles.rightContent]}>
          <Skeleton width="50%" height={LINE_HEIGHT} style={styles.name} />
          <Row justify="space-between">
            {Array.from({ length: STAT_COUNT }, (_, index) => (
              <View key={index} style={[commonStyles.flex1, commonStyles.alignCenter]}>
                <Stack gap="xs" style={commonStyles.alignCenter}>
                  <Skeleton width={ms(28)} height={LINE_HEIGHT} />
                  <Skeleton width={ms(52)} height={ms(10)} />
                </Stack>
              </View>
            ))}
          </Row>
        </View>
      </Row>
    </Section>

    <Section style={styles.bio}>
      <Stack gap="xs">
        <Skeleton width="70%" height={LINE_HEIGHT} />
        <Skeleton width="40%" height={LINE_HEIGHT} />
      </Stack>
    </Section>

    <Section style={styles.buttons}>
      <Row gap="sm">
        <Skeleton height={BUTTON_HEIGHT} borderRadius={ms(8)} style={commonStyles.flex1} />
        <Skeleton height={BUTTON_HEIGHT} borderRadius={ms(8)} style={commonStyles.flex1} />
      </Row>
    </Section>
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: ms(8),
  },
  rightContent: {
    marginStart: ms(5),
    justifyContent: 'center',
  },
  name: {
    marginBottom: ms(6),
    marginStart: ms(24),
  },
  bio: {
    marginTop: ms(12),
  },
  buttons: {
    marginTop: ms(16),
    marginBottom: ms(12),
  },
});
