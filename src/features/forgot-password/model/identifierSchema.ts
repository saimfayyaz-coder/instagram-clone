import { z } from 'zod';
import type { TFunction } from 'i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

export const createIdentifierSchema = (t: TFunction = i18n.t) =>
  z.object({
    identifier: z
      .string()
      .trim()
      .min(1, t(TRANSLATION_KEYS.AUTH_FORGOT_PASSWORD_IDENTIFIER_REQUIRED)),
  });

export const identifierSchema = createIdentifierSchema();

export type IdentifierSchemaType = z.infer<typeof identifierSchema>;
