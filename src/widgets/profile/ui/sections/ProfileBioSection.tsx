import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { User, UserLink } from '@/entities/user';
import { APP_ICONS, ACCESSIBILITY_ROLES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { formatDisplayUrl } from '@/shared/lib/formatters';
import { ms } from '@/shared/theme';

export interface ProfileBioSectionProps {
  user?: User | null;
  onOpenLinksSheet?: () => void;
  onOpenLinkUrl?: (url: string) => void;
}

export const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({
  user,
  onOpenLinksSheet,
  onOpenLinkUrl,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const bio = user?.bio?.trim();
  const links: UserLink[] = user?.links || [];

  const hasMultipleLinks = links.length > 1;
  const primaryLink = links[0];

  const handleLinkPress = useCallback(() => {
    if (hasMultipleLinks) {
      onOpenLinksSheet?.();
    } else if (primaryLink?.url) {
      onOpenLinkUrl?.(primaryLink.url);
    }
  }, [hasMultipleLinks, primaryLink, onOpenLinksSheet, onOpenLinkUrl]);

  if (!bio && links.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {Boolean(bio) && (
        <AppText
          variant="body"
          color={theme.colors.textPrimary}
          style={styles.bioText}
        >
          {bio}
        </AppText>
      )}

      {links.length > 0 && primaryLink && (
        <TouchableOpacity
          onPress={handleLinkPress}
          activeOpacity={0.7}
          style={styles.linkContainer}
          accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
          accessibilityLabel={primaryLink.title || primaryLink.url}
        >
          <Icon
            type="Ionicons"
            name={APP_ICONS.LINK}
            size={14}
            color={theme.colors.textPrimary}
            style={styles.linkIcon}
          />

          <AppText
            variant="body"
            weight="semibold"
            color={theme.colors.textPrimary}
            numberOfLines={1}
            style={styles.linkText}
          >
            {formatDisplayUrl(primaryLink.url)}
          </AppText>

          {hasMultipleLinks && (
            <AppText
              variant="body"
              weight="semibold"
              color={theme.colors.textSecondary}
              style={styles.moreCountText}
            >
              {t(TRANSLATION_KEYS.PROFILE_MORE_LINKS, { count: links.length - 1 })}
            </AppText>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(16),
    marginTop: ms(10),
  },
  bioText: {
    lineHeight: ms(19),
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(6),
  },
  linkIcon: {
    marginRight: ms(6),
  },
  linkText: {
    flexShrink: 1,
  },
  moreCountText: {
    marginLeft: ms(4),
  },
});
