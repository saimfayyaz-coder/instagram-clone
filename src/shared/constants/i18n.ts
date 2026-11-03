export const LANGUAGE_CODES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  UR: 'ur',
} as const;

export const DEFAULT_LANGUAGE = LANGUAGE_CODES.EN;

// Languages written right-to-left (matched on the base code, e.g. "ur" and "ur-PK")
export const RTL_LANGUAGES: readonly string[] = [LANGUAGE_CODES.UR];
