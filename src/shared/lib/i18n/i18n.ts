import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { storage, STORAGE_KEYS } from '../mmkv/appStorage';
import { applyRTLIfNeeded } from './rtl';

import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ur from './locales/ur.json';

// Bundled Zod error translations from zod-i18n-map
import zodEn from 'zod-i18n-map/locales/en/zod.json';
import zodFr from 'zod-i18n-map/locales/fr/zod.json';
import zodEs from 'zod-i18n-map/locales/es/zod.json';
// Custom Urdu Zod error map (zod-i18n-map doesn't ship Urdu)
import zodUr from './locales/ur/zod.json';

const resources = {
  en: { translation: en, zod: zodEn },
  fr: { translation: fr, zod: zodFr },
  es: { translation: es, zod: zodEs },
  ur: { translation: ur, zod: zodUr },
};

const savedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE) || 'en';

applyRTLIfNeeded(savedLanguage);

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Wire Zod's error map to i18next so all schema errors auto-translate
z.setErrorMap(zodI18nMap);

export const changeLanguage = (lang: string) => {
  storage.setString(STORAGE_KEYS.LANGUAGE, lang);
  const rtlChanged = applyRTLIfNeeded(lang);
  i18n.changeLanguage(lang);
  // Re-bind after language switch so live switching translates Zod errors too
  z.setErrorMap(zodI18nMap);
  return rtlChanged;
};

export default i18n;
