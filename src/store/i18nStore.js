let i18nConfig = null;

let currentCache = {
  flow: null,
  language: null,
  config: null,
};

export const setI18nConfig = (config, flow, language) => {
  i18nConfig = config;

  currentCache = {
    flow,
    language,
    config,
  };
};

export const getI18nConfigStore = () => i18nConfig;

export const getCachedI18nConfig = (flow, language) => {
  if (
    currentCache.flow === flow &&
    currentCache.language === language
  ) {
    return currentCache.config;
  }
  return null;
};