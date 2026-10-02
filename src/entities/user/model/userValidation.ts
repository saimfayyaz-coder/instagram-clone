import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export const USERNAME_REGEX = /^[a-zA-Z0-9._]+$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const NAME_MAX_LENGTH = 50;
export const BIO_MAX_LENGTH = 150;
export const WEBSITE_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

export const normalizeUrl = (url?: string | null): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/\//, '')}`;
};

export const createUsernameSchema = (t: TFunction = i18n.t) =>
  z
    .string()
    .trim()
    .min(USERNAME_MIN_LENGTH, t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_MIN_LENGTH))
    .max(USERNAME_MAX_LENGTH, t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_MAX_LENGTH))
    .regex(USERNAME_REGEX, t(TRANSLATION_KEYS.AUTH_SIGNUP_USERNAME_INVALID_CHARS));

export const usernameSchema = createUsernameSchema();

export const createNameSchema = (t: TFunction = i18n.t) =>
  z
    .string()
    .trim()
    .max(NAME_MAX_LENGTH, t(TRANSLATION_KEYS.PROFILE_NAME_MAX_LENGTH))
    .optional()
    .or(z.literal(''));

export const createBioSchema = (t: TFunction = i18n.t) =>
  z
    .string()
    .max(BIO_MAX_LENGTH, t(TRANSLATION_KEYS.PROFILE_BIO_MAX_LENGTH))
    .optional()
    .or(z.literal(''));

export const createWebsiteSchema = (t: TFunction = i18n.t) =>
  z
    .string()
    .trim()
    .transform(normalizeUrl)
    .refine((val) => !val || WEBSITE_REGEX.test(val), {
      message: t(TRANSLATION_KEYS.PROFILE_INVALID_WEBSITE),
    })
    .optional()
    .or(z.literal(''));
