import { getDomainDetail } from "./utils";

// combined logo

import ROUTES from "./url";

export const lang_codes = {
  kn: "kn-IN",
  en: "en-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  hi: "hi-IN",
  ml: "ml-IN",
  ne: "ne-IN",
  or: "or-IN",
  pa: "pa-IN",
  sa: "sa-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  id: "id-ID",
  enus: "en-US"
};

export const company_list = {
  shikshalokam: "shikshalokam",
};

export const company_host_list = {
  shikshalokam: "demo.shikshalokam.org",
};

export const company_reroute_list = {
  shikshalokam: "https://demo.shikshalokam.org"+ROUTES.LOGIN,
};

export const company_register_list = {
  shikshalokam: ROUTES.SHIKSHALOKAM,
};

export const all_companies = Object.keys(company_list);

export const available_languages = {
  [lang_codes.kn]: "Kannada (India)",
  [lang_codes.en]: "English (US)",
  [lang_codes.mr]: "Marathi (India)",
  [lang_codes.gu]: "Gujarati (India)",
  [lang_codes.hi]: "Hindi (India)",
  [lang_codes.ml]: "Malayalam (India)",
  [lang_codes.ne]: "Nepali (India)",
  [lang_codes.or]: "Odia (India)",
  [lang_codes.pa]: "Punjabi (India)",
  [lang_codes.sa]: "Sanskrit (India)",
  [lang_codes.ta]: "Tamil (India)",
  [lang_codes.bn]: "Bangla (India)",
  [lang_codes.id]: "Bahasa (Indonesia)",
};

let init_config = {
  company_logo: "",
  after_login_url: "",
  websocket_url: "",
  company_subdomain: "",
  company_name: "",
  preferredLanguage: lang_codes.en,
  collab_logo: './images/shikshagrahaLogo.png',
  allowed_languages: [lang_codes.en]
};


const getConfiguration = () => {
  const result = getDomainDetail();

  try {
    switch (result.subdomain) {
      case company_list.shikshalokam:
      case "":
        return {
          ...init_config,
          company_logo: './images/shikshagrahaLogo.png',
          after_login_url: ROUTES.STORY_LIST,
          websocket_url: "demo",
          company_subdomain: company_list.demo,
          company_name: "Demo",
          collab_logo: '/images/shikshagrahaLogo.png',
          host: company_host_list.demo,
          reroute: company_reroute_list.demo,
          register_url: company_register_list.demo,
          preferredLanguage: lang_codes.en,
          allowed_languages: [lang_codes.hi, lang_codes.en],
        };
      default:
        return init_config;
    }
  } catch (error) {
    console.error({ error });
  }
};

export default getConfiguration;
