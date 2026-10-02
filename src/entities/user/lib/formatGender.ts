import type { TFunction } from 'i18next';
import { GenderType, GENDER_TRANSLATION_MAP } from '../model/constants';

export const formatGenderLabel = (
  gender: GenderType | undefined,
  t: TFunction,
): string | undefined => {
  if (!gender) return undefined;
  const translationKey = GENDER_TRANSLATION_MAP[gender];
  return translationKey ? t(translationKey) : undefined;
};
