import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, FormField, Header, Row, Screen, Section, Stack, Text, Touchable } from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { ms, spacing } from '@/shared/theme';
import {
  ACCESSIBILITY_ROLES,
  MAIN_ROUTES,
  TAB_ROUTES,
  TEST_IDS,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { showToast } from '@/shared/lib/toast';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { POST_LIMITS } from '@/entities/post';
import {
  PostDetailsSchemaType,
  clearPostDraft,
  createClientRequestId,
  createPostDetailsSchema,
  postUploadStarted,
  runPostUpload,
  selectIsPostUploadBusy,
  selectPostDraft,
} from '@/features/create-post';

const CAPTION_THUMB_WIDTH = ms(64);
const ALT_THUMB_SIZE = ms(44);
// Show the caption counter once the caption gets close to the limit
const CAPTION_COUNTER_FROM = POST_LIMITS.CAPTION_MAX_LENGTH - 200;

export const CreatePostDetailsPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const isUploadBusy = useAppSelector(selectIsPostUploadBusy);
  const storedDraft = useAppSelector(selectPostDraft);
  // Kept locally so clearing the store on Share doesn't empty this screen while it closes
  const [draft] = useState(storedDraft);

  const schema = useMemo(() => createPostDetailsSchema(t), [t]);
  const { control, handleSubmit, watch } = useForm<PostDetailsSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      caption: '',
      location: '',
      altTexts: draft ? draft.images.map(() => '') : [],
    },
  });
  const captionLength = watch('caption').length;

  // Nothing to post (e.g. opened without picking photos)
  useEffect(() => {
    if (!draft) {
      navigation.goBack();
    }
  }, [draft, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleShare = useMemo(
    () =>
      handleSubmit(values => {
        if (!draft) return;
        if (isUploadBusy) {
          showToast({ message: t(TRANSLATION_KEYS.CREATE_POST_UPLOAD_BUSY) });
          return;
        }

        dispatch(
          postUploadStarted({
            id: createClientRequestId(),
            images: draft.images,
            aspectRatio: draft.aspectRatio,
            caption: values.caption.trim(),
            location: values.location,
            altTexts: values.altTexts,
          }),
        );
        dispatch(runPostUpload());
        dispatch(clearPostDraft());
        // Back to the profile, where the banner shows progress and the post appears
        navigation.popTo(MAIN_ROUTES.TABS, { screen: TAB_ROUTES.PROFILE });
      }),
    [dispatch, draft, handleSubmit, isUploadBusy, navigation, t],
  );

  const headerRight = useMemo(
    () => (
      <Touchable
        onPress={() => handleShare()}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        testID={TEST_IDS.CREATE_POST.SHARE}
      >
        <Text weight="semibold" color={theme.colors.actionPrimary}>
          {t(TRANSLATION_KEYS.CREATE_POST_SHARE)}
        </Text>
      </Touchable>
    ),
    [handleShare, t, theme.colors.actionPrimary],
  );

  if (!draft) {
    return null;
  }

  return (
    <Screen
      preset="form"
      header={
        <Header
          title={t(TRANSLATION_KEYS.CREATE_POST_TITLE)}
          onBack={handleBack}
          right={headerRight}
          showBottomBorder
        />
      }
    >
      <Section style={styles.section}>
        <Row gap="md" style={styles.captionRow}>
          <Image
            source={{ uri: draft.images[0].uri }}
            style={[
              styles.captionThumb,
              {
                height: CAPTION_THUMB_WIDTH / draft.aspectRatio,
                backgroundColor: theme.colors.bgSecondary,
              },
            ]}
          />
          <View style={styles.captionInput}>
            <Controller
              control={control}
              name="caption"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormField
                  placeholder={t(TRANSLATION_KEYS.CREATE_POST_CAPTION_PLACEHOLDER)}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  maxLength={POST_LIMITS.CAPTION_MAX_LENGTH}
                  multiline
                  errorMessage={error?.message}
                  testID={TEST_IDS.CREATE_POST.CAPTION_INPUT}
                />
              )}
            />
            {captionLength >= CAPTION_COUNTER_FROM && (
              <View style={styles.counterRow}>
                <Text variant="caption">
                  {`${captionLength} / ${POST_LIMITS.CAPTION_MAX_LENGTH}`}
                </Text>
              </View>
            )}
          </View>
        </Row>
      </Section>

      <Divider />

      <Section style={styles.section}>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <FormField
              label={t(TRANSLATION_KEYS.CREATE_POST_LOCATION)}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              maxLength={POST_LIMITS.LOCATION_MAX_LENGTH}
              floating
              errorMessage={error?.message}
              testID={TEST_IDS.CREATE_POST.LOCATION_INPUT}
            />
          )}
        />
      </Section>

      <Divider />

      <Section style={styles.section}>
        <Stack gap="md">
          <View>
            <Text weight="semibold">{t(TRANSLATION_KEYS.CREATE_POST_ALT_TEXT_TITLE)}</Text>
            <Text variant="caption">{t(TRANSLATION_KEYS.CREATE_POST_ALT_TEXT_SUBTITLE)}</Text>
          </View>

          {draft.images.map((image, index) => (
            <Row key={image.uri} gap="md" style={styles.altRow}>
              <Image
                source={{ uri: image.uri }}
                style={[styles.altThumb, { backgroundColor: theme.colors.bgSecondary }]}
              />
              <View style={styles.captionInput}>
                <Controller
                  control={control}
                  name={`altTexts.${index}`}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <FormField
                      placeholder={t(TRANSLATION_KEYS.CREATE_POST_ALT_TEXT_PLACEHOLDER, {
                        index: index + 1,
                      })}
                      accessibilityLabel={t(TRANSLATION_KEYS.CREATE_POST_PHOTO_LABEL, {
                        index: index + 1,
                      })}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      maxLength={POST_LIMITS.ALT_TEXT_MAX_LENGTH}
                      errorMessage={error?.message}
                      testID={TEST_IDS.CREATE_POST.ALT_TEXT_INPUT}
                    />
                  )}
                />
              </View>
            </Row>
          ))}
        </Stack>
      </Section>
    </Screen>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.md,
  },
  captionRow: {
    alignItems: 'flex-start',
  },
  captionThumb: {
    width: CAPTION_THUMB_WIDTH,
  },
  captionInput: {
    flex: 1,
  },
  // flex-end follows the layout direction, so the counter sits on the left in Urdu
  counterRow: {
    alignItems: 'flex-end',
  },
  altRow: {
    alignItems: 'flex-start',
  },
  altThumb: {
    width: ALT_THUMB_SIZE,
    height: ALT_THUMB_SIZE,
  },
});
