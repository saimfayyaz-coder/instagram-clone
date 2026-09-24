import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export const createOtpSchema = (t: TFunction = i18n.t) =>
  z.object({
    otp: z
      .string()
      .trim()
      .length(6, t(TRANSLATION_KEYS.AUTH_OTP_LENGTH_ERROR))
      .regex(/^\d{6}$/, t(TRANSLATION_KEYS.AUTH_OTP_DIGITS_ERROR)),
  });

export const otpSchema = createOtpSchema();

export type OtpSchemaType = z.infer<typeof otpSchema>;
