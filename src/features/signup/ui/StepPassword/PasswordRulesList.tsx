import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Icon } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks/useTheme';
import { ms } from '@/shared/theme/scaling';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export interface PasswordRulesListProps {
  hasMinLength: boolean;
  passwordsMatch: boolean;
  hasConfirmInput: boolean;
}

const RuleCheckItem: React.FC<{ satisfied: boolean; label: string }> = ({
  satisfied,
  label,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.ruleItem}>
      <Icon
        type="Ionicons"
        name={satisfied ? 'checkmark-circle' : 'ellipse-outline'}
        size={16}
        color={satisfied ? theme.colors.success : theme.colors.textSecondary}
      />
      <AppText
        variant="caption"
        color={satisfied ? theme.colors.success : theme.colors.textSecondary}
        style={styles.ruleLabel}
      >
        {label}
      </AppText>
    </View>
  );
};

export const PasswordRulesList: React.FC<PasswordRulesListProps> = ({
  hasMinLength,
  passwordsMatch,
  hasConfirmInput,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <RuleCheckItem
        satisfied={hasMinLength}
        label={t(TRANSLATION_KEYS.AUTH_SIGNUP_RULE_MIN_LENGTH)}
      />
      {hasConfirmInput && (
        <RuleCheckItem
          satisfied={passwordsMatch}
          label={t(TRANSLATION_KEYS.AUTH_SIGNUP_RULE_PASSWORDS_MATCH)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: ms(10),
    gap: ms(6),
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  ruleLabel: {
    fontSize: ms(12),
    lineHeight: ms(16),
  },
});
