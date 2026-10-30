import axiosInstance from "./axios"
import env from "./env"

// Root path for browser-level URLs. The React Router basename already
// includes it for in-app navigation, so only use this for window-level links.
export const getRootPath = () => {
  const raw = env.ROOT_PATH().replace(/^\/|\/$/g, "")
  return raw ? `/${raw}` : ""
}

// Fetches the rendered thank-you template for a mediaTemplate row.
export const getTemplateDetails = async (templateId, language = "en") => {
  const res = await axiosInstance.get(`api/template-details/${templateId}`, {
    params: { language },
  })
  return res.data
}