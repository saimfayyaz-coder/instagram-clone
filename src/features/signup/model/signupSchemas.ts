import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;

export const createStep1UsernameSchema = (t: TFunction = i18n.t) =>
  z.object({
    username: z
      .string()
      .trim()
      .min(3, t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_MIN_LENGTH))
      .max(30, t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_MAX_LENGTH))
      .regex(USERNAME_REGEX, t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_INVALID_CHARS)),
  });

export const createStep2PasswordSchema = (t: TFunction = i18n.t) =>
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
