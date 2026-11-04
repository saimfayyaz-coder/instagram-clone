import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/shared/ui/primitives/Text';
import { Section } from '@/shared/ui/layout/Section';
import { useTheme } from '@/shared/hooks/useTheme';

export interface ListSectionProps {
  title?: string;
  // Last section on the screen: no separator band underneath
  last?: boolean;
  children: React.ReactNode;
}

// A titled group of ListItem rows, followed by a gray band that separates it from the next group.
export const ListSection: React.FC<ListSectionProps> = ({
  title,
  last = false,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <Section style={{ paddingTop: theme.spacing.lg }}>
        {Boolean(title) && (
          <Text
            variant="caption"
            weight="semibold"
            color={theme.colors.textSecondary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            {title}
          </Text>
        )}
        {children}
      </Section>
      {!last && (
        <View
          style={[
            styles.band,
            {
              height: theme.spacing.sm,
              backgroundColor: theme.colors.bgSecondary,
            },
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  band: {
    width: '100%',
  },
});
