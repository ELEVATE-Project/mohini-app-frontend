import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import { getFromStorage } from './services/storage_service';

const preferredLanguage = getFromStorage('preferred_language', true, 'localStorage')?.value;
const languageToUse = 
  getFromStorage("route", true, "sessionStorage") || 
  getFromStorage("route", true, "localStorage") || 
  getFromStorage("local_route", true, "sessionStorage") || 
  getFromStorage("local_route", true, "localStorage") || 
  "en";
  
i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: languageToUse,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/mohini/locales/{{lng}}/{{ns}}.json',
    },
  });

export const setLanguage = (languageProp) => {
  const route = getFromStorage('route', true, 'sessionStorage') || getFromStorage('route', true, 'localStorage');
  const languageToUse = languageProp || route || 'en';
  console.log("Language set to: ", languageToUse);
  i18n.changeLanguage(languageToUse);
};

export default i18n;
