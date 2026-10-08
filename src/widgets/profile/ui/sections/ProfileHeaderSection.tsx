import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/atoms';
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
    <View style={[commonStyles.rowCenter, styles.container]}>
      <UserAvatar user={user} size={ms(78)} />

      <View style={[commonStyles.flex1, styles.rightContent]}>
        {Boolean(displayName) && (
          <AppText
            variant="body"
            weight="bold"
            numberOfLines={1}
            style={styles.displayName}
          >
            {displayName}
          </AppText>
        )}

        <View style={commonStyles.rowBetween}>
          <View style={[commonStyles.flex1, commonStyles.alignCenter]}>
            <AppText variant="body" weight="bold">
              {formatStat(user?.postsCount ?? 0)}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {t(TRANSLATION_KEYS.PROFILE_POSTS)}
            </AppText>
          </View>

          <View style={[commonStyles.flex1, commonStyles.alignCenter]}>
            <AppText variant="body" weight="bold">
              {formatStat(user?.followersCount ?? 0)}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {t(TRANSLATION_KEYS.PROFILE_FOLLOWERS)}
            </AppText>
          </View>

          <View style={[commonStyles.flex1, commonStyles.alignCenter]}>
            <AppText variant="body" weight="bold">
              {formatStat(user?.followingCount ?? 0)}
            </AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {t(TRANSLATION_KEYS.PROFILE_FOLLOWING)}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(16),
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
