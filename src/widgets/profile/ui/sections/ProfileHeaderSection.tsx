import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Section, Row } from '@/shared/ui';
import { UserAvatar, User, getUserDisplayName } from '@/entities/user';
import { useTheme } from '@/shared/hooks';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { formatStat } from '@/shared/lib/formatters';
import { commonStyles, ms } from '@/shared/theme';

export interface ProfileHeaderSectionProps {
  user?: User | null;
}

export const ProfileHeaderSection: React.FC<ProfileHeaderSectionProps> = ({ user }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const displayName = getUserDisplayName(user);

  return (
    <Section style={styles.container}>
      <Row>
        <UserAvatar user={user} size={ms(78)} />

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

            <View style={[commonStyles.flex1, commonStyles.alignCenter]}>
              <Text variant="body" weight="bold">
                {formatStat(user?.followersCount ?? 0)}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {t(TRANSLATION_KEYS.PROFILE_FOLLOWERS)}
              </Text>
            </View>

            <View style={[commonStyles.flex1, commonStyles.alignCenter]}>
              <Text variant="body" weight="bold">
                {formatStat(user?.followingCount ?? 0)}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {t(TRANSLATION_KEYS.PROFILE_FOLLOWING)}
              </Text>
            </View>
          </Row>
        </View>
      </Row>
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
