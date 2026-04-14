import { API_ENDPOINTS } from "../../constants/urls";
import { apiClient } from "../client";


export const getI18nConfigApi = async (flow_route, language = "en") => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.I18N_CONFIG, {
      params: {
        flow_route,
        language,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching i18n config", {
      status: error?.response?.status,
      message: error?.message,
    });
    throw error;
  }
};