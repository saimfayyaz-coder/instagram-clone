import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Divider,
  FormField,
  Header,
  Row,
  Screen,
  Section,
  Skeleton,
  Stack,
  Text,
  Touchable,
} from '@/shared/ui';
import { useTheme } from '@/shared/hooks';
import { sizes, spacing } from '@/shared/theme';
import {
  ACCESSIBILITY_ROLES,
  MAIN_ROUTES,
  TAB_ROUTES,
  TEST_IDS,
  TOAST_TYPES,
} from '@/shared/constants';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { MainStackParamList } from '@/shared/types';
import { showToast } from '@/shared/lib/toast';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { POST_CONFIG, POST_LIMITS } from '@/entities/post';
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

export const CreatePostDetailsPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const isUploadBusy = useAppSelector(selectIsPostUploadBusy);
  const storedDraft = useAppSelector(selectPostDraft);
  // Kept locally so clearing the store on Share doesn't empty this screen while it closes
  const [draft, setDraft] = useState(storedDraft);
  const images = draft?.images ?? null;
  const isCropping = !images;

  // Picks up the cropped photos once they're ready
  useEffect(() => {
    if (storedDraft) {
      setDraft(storedDraft);
    }
  }, [storedDraft]);

  const schema = useMemo(() => createPostDetailsSchema(t), [t]);
  const { control, handleSubmit, watch } = useForm<PostDetailsSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      caption: '',
      location: '',
      altTexts: Array.from({ length: draft?.imageCount ?? 0 }, () => ''),
    },
  });
  const captionLength = watch('caption').length;

  // Nothing to post (e.g. opened without picking photos)
  useEffect(() => {
    if (!draft) {
      navigation.goBack();
    }
  }, [draft, navigation]);

  useEffect(() => {
    if (draft?.cropFailed) {
      showToast({ message: t(TRANSLATION_KEYS.MEDIA_PICKER_CROP_FAILED), type: TOAST_TYPES.ERROR });
      dispatch(clearPostDraft());
      navigation.goBack();
    }
  }, [dispatch, draft?.cropFailed, navigation, t]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleShare = useMemo(
    () =>
      handleSubmit(values => {
        if (!draft || !images) return;
        if (isUploadBusy) {
          showToast({ message: t(TRANSLATION_KEYS.CREATE_POST_UPLOAD_BUSY) });
          return;
        }

        dispatch(
          postUploadStarted({
            id: createClientRequestId(),
            images,
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
    [dispatch, draft, handleSubmit, images, isUploadBusy, navigation, t],
  );

  const headerRight = useMemo(
    () => (
      <Touchable
        onPress={() => handleShare()}
        // Cropping usually finishes before the caption is written
        disabled={isCropping}
        accessibilityRole={ACCESSIBILITY_ROLES.BUTTON}
        testID={TEST_IDS.CREATE_POST.SHARE}
      >
        <Text
          weight="semibold"
          color={isCropping ? theme.colors.actionPrimaryDisabled : theme.colors.actionPrimary}
        >
          {t(TRANSLATION_KEYS.CREATE_POST_SHARE)}
        </Text>
      </Touchable>
    ),
    [handleShare, isCropping, t, theme.colors],
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
          {images ? (
            <Image
              source={{ uri: images[0].uri }}
              style={[
                styles.captionThumb,
                {
                  height: sizes.thumbLg / draft.aspectRatio,
                  backgroundColor: theme.colors.bgSecondary,
                },
              ]}
            />
          ) : (
            <Skeleton
              width={sizes.thumbLg}
              height={sizes.thumbLg / draft.aspectRatio}
              borderRadius={0}
            />
          )}
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
            {captionLength >= POST_CONFIG.CAPTION_COUNTER_FROM && (
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

          {Array.from({ length: draft.imageCount }, (_, index) => (
            <Row key={index} gap="md" style={styles.altRow}>
              {images ? (
                <Image
                  source={{ uri: images[index].uri }}
                  style={[styles.altThumb, { backgroundColor: theme.colors.bgSecondary }]}
                />
              ) : (
                <Skeleton width={sizes.thumbMd} height={sizes.thumbMd} borderRadius={0} />
              )}
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
    width: sizes.thumbLg,
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
    width: sizes.thumbMd,
    height: sizes.thumbMd,
  },
});
