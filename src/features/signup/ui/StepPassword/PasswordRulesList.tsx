import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText } from '@/shared/components/atoms';
import { useTheme } from '@/shared/hooks/useTheme';

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
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        {satisfied ? (
          <Path
            d="M5 13l4 4L19 7"
            stroke="#4BB543"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <Path
            d="M12 8v4m0 4h.01"
            stroke={theme.colors.textSecondary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </Svg>
      <AppText
        variant="caption"
        color={satisfied ? '#4BB543' : theme.colors.textSecondary}
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
  return (
    <View style={styles.container}>
      <RuleCheckItem
        satisfied={hasMinLength}
        label="At least 6 characters"
      />
      {hasConfirmInput && (
        <RuleCheckItem
          satisfied={passwordsMatch}
          label={passwordsMatch ? 'Passwords match' : 'Passwords must match'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    gap: 6,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleLabel: {
    fontSize: 12,
  },
});
