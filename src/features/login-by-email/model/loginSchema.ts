import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export const createLoginSchema = (t: TFunction = i18n.t) =>
  z.object({
    identifier: z
      .string()
      .trim()
      .min(1, t(TRANSLATION_KEYS.AUTH_LOGIN_IDENTIFIER_REQUIRED)),
    password: z
      .string()
      .min(1, t(TRANSLATION_KEYS.AUTH_LOGIN_PASSWORD_REQUIRED))
      .superRefine((val, ctx) => {
        if (val.length > 0 && val.length < 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t(TRANSLATION_KEYS.AUTH_LOGIN_PASSWORD_MIN_LENGTH),
          });
        }
      }),
  });

export const loginSchema = createLoginSchema();

export type LoginSchemaType = z.infer<typeof loginSchema>;
