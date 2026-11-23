import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Section, Row, AvatarPreview, Touchable } from '@/shared/ui';
import { UserAvatar, User, getUserDisplayName, useUserAvatarUri } from '@/entities/user';
import { useTheme } from '@/shared/hooks';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { formatStat } from '@/shared/lib/formatters';
import { commonStyles, ms } from '@/shared/theme';
import { ACCESSIBILITY_ROLES, TEST_IDS } from '@/shared/constants';

export interface ProfileHeaderSectionProps {
  user?: User | null;
  onPressFollowers?: () => void;
  onPressFollowing?: () => void;
}

export const ProfileHeaderSection: React.FC<ProfileHeaderSectionProps> = ({
  user,
  onPressFollowers,
  onPressFollowing,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const displayName = getUserDisplayName(user);
  const { uri: avatarUri } = useUserAvatarUri(user);
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);

  return (
    <Section style={styles.container}>
      <Row>
        <UserAvatar
          user={user}
          size={ms(78)}
          // No photo, nothing to enlarge
          onPress={avatarUri ? () => setIsAvatarPreviewOpen(true) : undefined}
          testID={TEST_IDS.PROFILE.AVATAR}
        />

        <View style={[commonStyles.flex1, styles.rightContent]}>
          {displayName && (
            <Text
              variant="body"
              weight="bold"
              numberOfLines={1}
              style={styles.displayName}
            >
              {displayName}
            </Text>
          )}

          <Row justify="space-between">
            <View style={[commonStyles.flex1, commonStyles.alignCenter]}>
              <Text variant="body" weight="bold">
                {formatStat(user?.postsCount ?? 0)}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {t(TRANSLATION_KEYS.PROFILE_POSTS)}
              </Text>
            </View>

            <Touchable
              onPress={onPressFollowers}
              disabled={!onPressFollowers}
              accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
              testID={TEST_IDS.PROFILE.FOLLOWERS_STAT}
              style={[commonStyles.flex1, commonStyles.alignCenter]}
            >
              <Text variant="body" weight="bold">
                {formatStat(user?.followersCount ?? 0)}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {t(TRANSLATION_KEYS.PROFILE_FOLLOWERS)}
              </Text>
            </Touchable>

            <Touchable
              onPress={onPressFollowing}
              disabled={!onPressFollowing}
              accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
              testID={TEST_IDS.PROFILE.FOLLOWING_STAT}
              style={[commonStyles.flex1, commonStyles.alignCenter]}
            >
              <Text variant="body" weight="bold">
                {formatStat(user?.followingCount ?? 0)}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {t(TRANSLATION_KEYS.PROFILE_FOLLOWING)}
              </Text>
            </Touchable>
          </Row>
        </View>
      </Row>
      <AvatarPreview
        visible={isAvatarPreviewOpen}
        uri={avatarUri}
        onClose={() => setIsAvatarPreviewOpen(false)}
        testID={TEST_IDS.PROFILE.AVATAR_PREVIEW}
      />
    </Section>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: ms(8),
  },
  rightContent: {
    marginLeft: ms(5),
    justifyContent: 'center',
  },
  displayName: {
    marginBottom: ms(6),
    paddingLeft: ms(24),
  },
});
