import env from "../utils/env"
import ROUTES from "../url"

// The wrapper returns to <origin>/sso?flow=<flow>&accToken=<token>&preferred_language=<lang>
function appReturnUrl(flow) {
  const rootPath = (env.ROOT_PATH() || "").replace(/^\/|\/$/g, "")
  const prefix = rootPath ? `/${rootPath}` : ""
  return `${window.location.origin}${prefix}${ROUTES.SSO_MITRA}?flow=${encodeURIComponent(flow)}`
}

export function buildWrapperLoginUrl({ flow, preferredLanguage }) {
  const base = env.get("REACT_APP_ELEVATE_WRAPPER_URL", "")
  if (!base) console.error("REACT_APP_ELEVATE_WRAPPER_URL is not set")

  const params = new URLSearchParams({ redirectUrl: appReturnUrl(flow) })
  if (preferredLanguage) params.set("preferred_language", preferredLanguage)
  return `${base}?${params.toString()}`
}

// Opens the Elevate account page in the same tab.
// The token lets the account page know who is logged in. The page returns to /sso.
export function buildWrapperProfileUrl({ flow, preferredLanguage, accessToken }) {
  const base = env.get("REACT_APP_ELEVATE_PROFILE_URL", "") || env.get("REACT_APP_ELEVATE_WRAPPER_URL", "")
  if (!base) console.error("Profile URL is not set")

  const params = new URLSearchParams({
    redirecturl: appReturnUrl(flow),
    flow,
  })
  if (preferredLanguage) params.set("preferred_language", preferredLanguage)
  if (accessToken) params.set("accToken", accessToken)
  return `${base}?${params.toString()}`
}