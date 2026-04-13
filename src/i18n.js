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
    fallbackLng: "en",
    debug: true,
    returnNull: false,
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
        if (!lng || !ns) {
          console.warn("Invalid i18n params:", { lng, ns });
          return null;
        }

        const config = getI18nConfigStore();
        const url = config?.[ns]?.[lng];

        if (url) return url;

        const basePath = env.ROOT_PATH()
          ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}`
          : "";

        return `${basePath}/locales/${lng}/${ns}.json`;
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
          .catch(() => {
            const basePath = env.ROOT_PATH()
              ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}`
              : "";
            
            if (!options?.lng || !options?.ns) {
              return callback(new Error("Invalid fallback params"), null);
            }

            const fallbackUrl = `${basePath}/locales/${options.lng}/${options.ns}.json`;
            fetch(fallbackUrl)
              .then(res => {
                const contentType = res.headers.get("content-type");
                if (!res.ok || !contentType?.includes("application/json")) {
                  throw new Error("Fallback not JSON");
                }
                return res.json();
              })
              .then(data => {
                callback(null, { data, status: 200 });
              })
              .catch(err => {
                console.error("Both primary and fallback failed:", err);
                callback(err, null);
              });
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
  try {

    const cached = getCachedI18nConfig(flow, language);

    let config;
    if (cached) {
      config = cached;
    } else {
      config = await getI18nConfigApi(flow, language);
    }

    setI18nConfig(config, flow, language);

    resetI18n();

    await i18n.changeLanguage(language);

    const usedNamespaces =
      i18n.reportNamespaces?.getUsedNamespaces?.() || ["common"];


    await i18n.loadNamespaces(usedNamespaces);

  } catch (error) {
    console.error("i18n config API failed, using fallback");
    setI18nConfig({}, flow, language);
  }
};

export default i18n
