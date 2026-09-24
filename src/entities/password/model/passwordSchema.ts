import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export const createPasswordSchema = (t: TFunction = i18n.t) =>
  z
    .object({
      password: z
        .string()
        .min(6, t(TRANSLATION_KEYS.AUTH_LOGIN_PASSWORD_MIN_LENGTH)),
      confirmPassword: z
        .string()
        .min(1, t(TRANSLATION_KEYS.AUTH_SIGNUP_CONFIRM_PASSWORD_REQUIRED)),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t(TRANSLATION_KEYS.AUTH_SIGNUP_PASSWORD_MISMATCH),
      path: ['confirmPassword'],
    });

export const passwordSchema = createPasswordSchema();

export type PasswordSchemaType = z.infer<ReturnType<typeof createPasswordSchema>>;
