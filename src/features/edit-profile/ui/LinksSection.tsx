import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { APP_ICONS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { ms } from '@/shared/theme';

export interface LinksSectionProps {
  website?: string | null;
  onAddLink: () => void;
  onOpenLink?: () => void;
}

export const LinksSection: React.FC<LinksSectionProps> = ({
  website,
  onAddLink,
  onOpenLink,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handlePressLink = onOpenLink || onAddLink;

  return (
    <View style={styles.container}>
      {/* Top Header Row: Links on left, Add link on right */}
      <View style={styles.headerRow}>
        <AppText
          variant="body"
          weight="semibold"
          color={theme.colors.textPrimary}
          style={styles.linksTitle}
        >
          {t(TRANSLATION_KEYS.PROFILE_LINKS)}
        </AppText>

        <TouchableOpacity
          onPress={onAddLink}
          activeOpacity={0.7}
          style={styles.addButton}
          accessibilityRole="button"
          accessibilityLabel="Add link"
        >
          <AppText
            variant="body"
            weight="semibold"
            color={theme.colors.actionPrimary}
            style={styles.addText}
          >
            Add link
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Existing link row if user has a website/link */}
      {Boolean(website) && (
        <TouchableOpacity
          onPress={handlePressLink}
          activeOpacity={0.75}
          style={[
            styles.linkItem,
            {
              backgroundColor: theme.colors.bgSecondary,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.sm,
            },
          ]}
        >
          <Icon
            type="Ionicons"
            name={APP_ICONS.LINK}
            size={18}
            color={theme.colors.textSecondary}
            style={styles.linkIcon}
          />
          <AppText
            variant="body"
            color={theme.colors.textPrimary}
            numberOfLines={1}
            style={styles.linkUrl}
          >
            {website}
          </AppText>
          <Icon
            type="Ionicons"
            name={APP_ICONS.CHEVRON_FORWARD}
            size={16}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: ms(8),
    marginBottom: ms(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(10),
    paddingHorizontal: ms(2),
  },
  linksTitle: {
    fontSize: ms(15),
  },
  addButton: {
    paddingVertical: ms(4),
    paddingHorizontal: ms(6),
  },
  addText: {
    fontSize: ms(14),
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(12),
    height: ms(44),
    borderWidth: 1,
    marginTop: ms(6),
  },
  linkIcon: {
    marginRight: ms(8),
  },
  linkUrl: {
    flex: 1,
    fontSize: ms(14),
    marginRight: ms(8),
  },
});
