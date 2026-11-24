import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query';
import { Icon, Input, Screen, Section, Touchable } from '@/shared/ui';
import { UserSummary, USER_SEARCH_CONFIG, useSearchUsersQuery } from '@/entities/user';
import { UserListWidget } from '@/widgets/user-list';
import { useDebouncedCallback, useTheme } from '@/shared/hooks';
import { ACCESSIBILITY_ROLES, APP_ICONS, MAIN_ROUTES, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { iconSize, spacing } from '@/shared/theme';

const NO_USERS: UserSummary[] = [];

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [text, setText] = useState('');
  // The query that was actually sent, so results don't flicker on every keystroke
  const [query, setQuery] = useState('');
  const { debouncedCallback: updateQuery, cancel } = useDebouncedCallback(
    (value: string) => setQuery(value.trim()),
    USER_SEARCH_CONFIG.DEBOUNCE_MS,
  );

  const { data, isFetching, isError, refetch } = useSearchUsersQuery(query || skipToken);

  const handleChangeText = useCallback(
    (value: string) => {
      setText(value);
      updateQuery(value);
    },
    [updateQuery],
  );

  const handleClear = useCallback(() => {
    cancel();
    setText('');
    setQuery('');
  }, [cancel]);

  const handlePressUser = useCallback(
    (user: UserSummary) => {
      navigation.navigate(MAIN_ROUTES.USER_PROFILE, { userId: user.id, username: user.username });
    },
    [navigation],
  );

  const hasQuery = query.length > 0;

  return (
    <Screen safeAreaEdges={['top']}>
      <Section style={styles.searchBar}>
        <Input
          value={text}
          onChangeText={handleChangeText}
          placeholder={t(TRANSLATION_KEYS.SEARCH_PLACEHOLDER)}
          maxLength={USER_SEARCH_CONFIG.MAX_LENGTH}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          testID={TEST_IDS.SEARCH.INPUT}
          rightElement={
            text ? (
              <Touchable
                onPress={handleClear}
                accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
                accessibilityLabel={t(TRANSLATION_KEYS.SEARCH_CLEAR)}
                testID={TEST_IDS.SEARCH.CLEAR}
              >
                <Icon
                  type="Ionicons"
                  name={APP_ICONS.CLOSE_CIRCLE}
                  size={iconSize.sm}
                  color={theme.colors.textSecondary}
                />
              </Touchable>
            ) : undefined
          }
        />
      </Section>

      <UserListWidget
        users={hasQuery && data ? data : NO_USERS}
        isLoading={hasQuery && isFetching && !data}
        isError={hasQuery && isError}
        onRetry={refetch}
        onPressUser={handlePressUser}
        emptyIcon={APP_ICONS.SEARCH}
        emptyTitle={
          hasQuery
            ? t(TRANSLATION_KEYS.SEARCH_NO_RESULTS, { query })
            : t(TRANSLATION_KEYS.SEARCH_PROMPT_TITLE)
        }
        emptySubtitle={hasQuery ? undefined : t(TRANSLATION_KEYS.SEARCH_PROMPT_SUBTITLE)}
        errorTitle={t(TRANSLATION_KEYS.SEARCH_FAILED)}
        retryLabel={t(TRANSLATION_KEYS.COMMON_TRY_AGAIN)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    paddingVertical: spacing.sm,
  },
});
