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
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: (lng, ns) => {
        const config = getI18nConfigStore();
        const url = config?.[ns]?.[lng];

        if (!url) {
          const basePath = env.ROOT_PATH()
            ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}`
            : "";

          return `${basePath}/locales/${lng}/${ns}.json`;
        }

        return url;
      },

      request: (options, url, payload, callback) => {
        fetch(url)
          .then(res => {
            if (!res.ok) throw new Error("Primary fetch failed");
            return res.json();
          })
          .then(data => callback(null, { data, status: 200 }))
          .catch(() => {
            const basePath = env.ROOT_PATH()
              ? `/${env.ROOT_PATH().replace(/^\/|\/$/g, "")}`
              : "";

            const fallbackUrl = `${basePath}/locales/${options.lng}/${options.ns}.json`;

            fetch(fallbackUrl)
              .then(res => {
                if (!res.ok) throw new Error("Fallback fetch failed");
                return res.json();
              })
              .then(data => {
                console.warn("Using local fallback for:", options.ns, options.lng);
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
  console.log("Language set to: ", languageToUse)
  i18n.changeLanguage(languageToUse)
}

export const loadI18nForFlow = async (flow, language = "en") => {
  try {
    const cached = getCachedI18nConfig(flow, language);

    if (cached) {
      setI18nConfig(cached, flow, language);
    } else {
      const config = await getI18nConfigApi(flow, language);
      setI18nConfig(config, flow, language);
    }
  } catch (error) {
    console.error("i18n config API failed, using fallback");

    setI18nConfig({}, flow, language);
  }

  // reload anyway
  await i18n.reloadResources(language);
  await i18n.changeLanguage(language);
};

export default i18n
