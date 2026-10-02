import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { createPasswordSchema } from '@/entities/password';
import {
  createUsernameSchema,
  USERNAME_REGEX,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from '@/entities/user';

export { USERNAME_REGEX, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH };

export const createStep1UsernameSchema = (t: TFunction = i18n.t) =>
  z.object({
    username: createUsernameSchema(t),
  });

export const createStep2PasswordSchema = createPasswordSchema;

export const createStep3EmailSchema = (t: TFunction = i18n.t) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, t(TRANSLATION_KEYS.AUTH_SIGNUP_EMAIL_REQUIRED))
      .email(t(TRANSLATION_KEYS.AUTH_SIGNUP_EMAIL_INVALID)),
    name: z.string().trim().optional(),
  });

export type Step1UsernameSchemaType = z.infer<ReturnType<typeof createStep1UsernameSchema>>;
export type Step2PasswordSchemaType = z.infer<ReturnType<typeof createStep2PasswordSchema>>;
export type Step3EmailSchemaType = z.infer<ReturnType<typeof createStep3EmailSchema>>;
