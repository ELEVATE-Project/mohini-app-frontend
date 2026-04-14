import i18n from "i18next"
import { LANGUAGE_ENUMS } from "pages/ShikshalokamVoiceChat/enum"
import { initReactI18next } from "react-i18next"
import HttpApi from "i18next-http-backend"
import { useSiteDataSessionStore } from "store"
import env from "./utils/env"
import { getCachedI18nConfig, getI18nConfigStore, setI18nConfig } from "./store/i18nStore"
import { getI18nConfigApi } from "./api/endpoints/i18n"

const chatLanguageLocal = useSiteDataSessionStore.getState().getChatLanguage()
const languageToUse = chatLanguageLocal || LANGUAGE_ENUMS.ENGLISH

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: languageToUse,
    fallbackLng: false,
    load: "currentOnly",
    debug: true,
    returnNull: false,
    ns: [],
    defaultNS: false,
  returnEmptyString: false,
  parseMissingKeyHandler: () => "",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: (lng, ns) => {
        const config = getI18nConfigStore();
        const namespace = Array.isArray(ns) ? ns[0] : ns;
        const language = Array.isArray(lng) ? lng[0] : lng;

        if (!language || language === "dev") {
          return null;
        }

        const url = config?.[namespace]?.[language];

        if (url) return url;

        const basePath = env.ROOT_PATH()
          ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}`
          : "";

        return `${basePath}/locales/${language}/${namespace}.json`;
      },

      request: (options, url, payload, callback) => {
        fetch(url)
          .then(res => {
            const contentType = res.headers.get("content-type");
            if (!res.ok || !contentType?.includes("application/json")) {
              throw new Error("Primary fetch not JSON");
            }
            return res.json();
          })
          .then(data => callback(null, { data, status: 200 }))
          .catch(err => {
            console.error("i18n load failed:", url, err);
            callback(err, null);
          });
      }
    }
  })

export const setLanguage = languageProp => {
  const route = JSON.parse(sessionStorage.getItem("route")) || JSON.parse(localStorage.getItem("route"))
  const languageToUse = languageProp || route || "en"
  i18n.changeLanguage(languageToUse)
}

export const resetI18n = () => {
  i18n.store.data = {};

  if (i18n.services?.backendConnector?.backend?.options) {
    i18n.services.backendConnector.state = {};
  }
};

export const loadI18nForFlow = async (flow, language = "en") => {
  let config = {};
  try {

    config =
      getCachedI18nConfig(flow, language) ??
      (await getI18nConfigApi(flow, language)) ??
      {};

  } catch (error) {
    console.error("i18n config API failed", {
      message: error?.message,
    });
  }
  setI18nConfig(config, flow, language);
  resetI18n();
  await i18n.changeLanguage(language);

  const configuredNamespaces = Object.keys(config);
  await i18n.loadNamespaces(
    configuredNamespaces.length > 0 ? configuredNamespaces : ["common"]
  );
};

export default i18n
