import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { POST_LIMITS, countCaptionTags } from '@/entities/post';

export const createPostDetailsSchema = (t: TFunction = i18n.t) =>
  z.object({
    caption: z
      .string()
      .max(
        POST_LIMITS.CAPTION_MAX_LENGTH,
        t(TRANSLATION_KEYS.CREATE_POST_CAPTION_TOO_LONG, { max: POST_LIMITS.CAPTION_MAX_LENGTH }),
      )
      .refine(caption => countCaptionTags(caption).hashtags <= POST_LIMITS.MAX_HASHTAGS, {
        message: t(TRANSLATION_KEYS.CREATE_POST_TOO_MANY_HASHTAGS, {
          max: POST_LIMITS.MAX_HASHTAGS,
        }),
      })
      .refine(caption => countCaptionTags(caption).mentions <= POST_LIMITS.MAX_MENTIONS, {
        message: t(TRANSLATION_KEYS.CREATE_POST_TOO_MANY_MENTIONS, {
          max: POST_LIMITS.MAX_MENTIONS,
        }),
      }),
    location: z
      .string()
      .trim()
      .max(
        POST_LIMITS.LOCATION_MAX_LENGTH,
        t(TRANSLATION_KEYS.CREATE_POST_LOCATION_TOO_LONG, {
          max: POST_LIMITS.LOCATION_MAX_LENGTH,
        }),
      ),
    altTexts: z.array(
      z
        .string()
        .trim()
        .max(
          POST_LIMITS.ALT_TEXT_MAX_LENGTH,
          t(TRANSLATION_KEYS.CREATE_POST_ALT_TEXT_TOO_LONG, {
            max: POST_LIMITS.ALT_TEXT_MAX_LENGTH,
          }),
        ),
    ),
  });

export const postDetailsSchema = createPostDetailsSchema();

export type PostDetailsSchemaType = z.infer<typeof postDetailsSchema>;
