import type { TFunction } from 'i18next';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';
import { GenderType } from '../model/types';

export const formatGenderLabel = (
  gender: GenderType | undefined,
  t: TFunction,
): string | undefined => {
  switch (gender) {
    case 'male':
      return t(TRANSLATION_KEYS.PROFILE_GENDER_MALE);
    case 'female':
      return t(TRANSLATION_KEYS.PROFILE_GENDER_FEMALE);
    case 'custom':
      return t(TRANSLATION_KEYS.PROFILE_GENDER_CUSTOM);
    case 'prefer_not_to_say':
      return t(TRANSLATION_KEYS.PROFILE_GENDER_PREFER_NOT_TO_SAY);
    default:
      return undefined;
  }
};
