import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks';
import { ACCESSIBILITY_ROLES } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { UserLink } from '@/entities/user';
import { ms } from '@/shared/theme';

export interface LinksSectionProps {
  links?: UserLink[];
  onAddLink: () => void;
  onOpenLinks: () => void;
}

export const LinksSection: React.FC<LinksSectionProps> = ({
  links = [],
  onAddLink,
  onOpenLinks,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const count = links.length;
  const hasLinks = count > 0;

  return (
    <TouchableOpacity
      onPress={hasLinks ? onOpenLinks : onAddLink}
      activeOpacity={0.7}
      style={styles.container}
      accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
      accessibilityLabel={
        hasLinks
          ? `${t(TRANSLATION_KEYS.PROFILE_LINKS)}, ${count}`
          : t(TRANSLATION_KEYS.PROFILE_ADD_LINK)
      }
    >
      <View style={styles.headerRow}>
        <AppText
          variant="body"
          weight="semibold"
          color={theme.colors.textPrimary}
          style={styles.linksTitle}
        >
          {t(TRANSLATION_KEYS.PROFILE_LINKS)}
        </AppText>

        {hasLinks ? (
          <AppText
            variant="body"
            color={theme.colors.textSecondary}
            style={styles.countText}
          >
            {count}
          </AppText>
        ) : (
          <AppText
            variant="body"
            weight="semibold"
            color={theme.colors.actionPrimary}
            style={styles.addText}
          >
            {t(TRANSLATION_KEYS.PROFILE_ADD_LINK)}
          </AppText>
        )}
      </View>
    </TouchableOpacity>
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
  countText: {
    fontSize: ms(14),
  },
  addText: {
    fontSize: ms(14),
  },
});
