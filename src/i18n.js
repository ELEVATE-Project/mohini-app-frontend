import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

const languageToUse = JSON.parse(localStorage.getItem("route")) || "en";

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: languageToUse,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
