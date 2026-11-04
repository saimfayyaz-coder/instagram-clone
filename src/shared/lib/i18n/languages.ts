import { LANGUAGE_CODES } from '@/shared/constants/i18n';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

// Languages offered in the language picker
export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: LANGUAGE_CODES.EN, name: 'English (US)', nativeName: 'English (US)' },
  { code: LANGUAGE_CODES.ES, name: 'Spanish', nativeName: 'Español' },
  { code: LANGUAGE_CODES.FR, name: 'French', nativeName: 'Français' },
  { code: LANGUAGE_CODES.UR, name: 'Urdu', nativeName: 'اردو' },
];
