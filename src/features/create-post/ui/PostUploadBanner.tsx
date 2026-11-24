import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Icon, Loader, Row, Section, Text, Touchable } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { hitSlop, iconSize, ms, sizes, spacing } from '@/shared/theme';
import { ACCESSIBILITY_ROLES, APP_ICONS, TEST_IDS } from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { POST_UPLOAD_STATUS } from '../model/constants';
import { selectPostUpload } from '../model/selectors';
import { postUploadCleared, postUploadRetried } from '../model/postComposerSlice';
import { runPostUpload } from '../model/runPostUpload';

// "Posting…" strip shown at the top of Feed and Profile while a post uploads in the background
export const PostUploadBanner: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const upload = useAppSelector(selectPostUpload);

  const handleRetry = useCallback(() => {
    dispatch(postUploadRetried());
    dispatch(runPostUpload());
  }, [dispatch]);

  const handleDiscard = useCallback(() => dispatch(postUploadCleared()), [dispatch]);

  if (!upload) {
    return null;
  }

  const total = upload.images.length;
  const uploadedCount = upload.mediaIds.filter(Boolean).length;
  const isFailed = upload.status === POST_UPLOAD_STATUS.FAILED;
  const isDone = upload.status === POST_UPLOAD_STATUS.DONE;
  // Creating the post counts as the last step
  const progress = isDone ? 1 : uploadedCount / (total + 1);

  const statusText = (() => {
    switch (upload.status) {
      case POST_UPLOAD_STATUS.FAILED:
        return t(TRANSLATION_KEYS.CREATE_POST_FAILED);
      case POST_UPLOAD_STATUS.DONE:
        return t(TRANSLATION_KEYS.CREATE_POST_SHARED);
      case POST_UPLOAD_STATUS.CREATING:
        return t(TRANSLATION_KEYS.CREATE_POST_FINISHING);
      default:
        return total > 1
          ? t(TRANSLATION_KEYS.CREATE_POST_UPLOADING, {
              current: Math.min(uploadedCount + 1, total),
              total,
            })
          : t(TRANSLATION_KEYS.CREATE_POST_POSTING);
    }
  })();

  return (
    <View
      style={[styles.container, { borderBottomColor: theme.colors.border }]}
      testID={TEST_IDS.CREATE_POST.UPLOAD_BANNER}
      accessibilityLiveRegion="polite"
    >
      <Section>
        <Row gap="md" style={styles.row}>
          <Image
            source={{ uri: upload.images[0]?.uri }}
            style={[styles.thumb, { backgroundColor: theme.colors.bgSecondary }]}
          />

          <View style={styles.texts}>
            <Text weight="semibold" numberOfLines={1}>
              {statusText}
            </Text>
            {isFailed && upload.errorMessage ? (
              <Text variant="caption" numberOfLines={2}>
                {upload.errorMessage}
              </Text>
            ) : null}
          </View>

          {isFailed ? (
            <Row gap="lg">
              <Touchable
                onPress={handleRetry}
                hitSlop={hitSlop.md}
                accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
                accessibilityLabel={t(TRANSLATION_KEYS.CREATE_POST_RETRY)}
                testID={TEST_IDS.CREATE_POST.UPLOAD_RETRY}
              >
                <Icon
                  type="Ionicons"
                  name={APP_ICONS.REFRESH}
                  size={iconSize.md}
                  color={theme.colors.textPrimary}
                />
              </Touchable>
              <Touchable
                onPress={handleDiscard}
                hitSlop={hitSlop.md}
                accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
                accessibilityLabel={t(TRANSLATION_KEYS.CREATE_POST_DISCARD)}
                testID={TEST_IDS.CREATE_POST.UPLOAD_DISCARD}
              >
                <Icon
                  type="Ionicons"
                  name={APP_ICONS.CLOSE}
                  size={iconSize.md}
                  color={theme.colors.textPrimary}
                />
              </Touchable>
            </Row>
          ) : isDone ? (
            <Icon
              type="Ionicons"
              name={APP_ICONS.CHECKMARK_CIRCLE}
              size={iconSize.md}
              color={theme.colors.success}
            />
          ) : (
            <Loader size="small" />
          )}
        </Row>
      </Section>

      {!isFailed && (
        <View style={[styles.track, { backgroundColor: theme.colors.divider }]}>
          <View
            style={[
              styles.fill,
              { width: `${progress * 100}%`, backgroundColor: theme.colors.actionPrimary },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    paddingVertical: spacing.sm,
  },
  thumb: {
    width: sizes.thumbSm,
    height: sizes.thumbSm,
    borderRadius: ms(4),
  },
  texts: {
    flex: 1,
  },
  track: {
    height: sizes.progressBar,
  },
  fill: {
    height: sizes.progressBar,
  },
});
