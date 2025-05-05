import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../public/locales/en/translation.json';
import ua from '../../public/locales/ua/translation.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'ua'],
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: en },
    ua: { translation: ua },
  },
});

export default i18n;
