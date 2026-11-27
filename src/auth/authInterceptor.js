import { clearFlowToken, getFlowToken } from "./flowTokenStore"

// Active flow is read from the URL, the same way the chat routes read it.
const currentFlow = () => new URLSearchParams(window.location.search).get("flow")

// Only the profile check decides whether the login is still valid.
const TOKEN_CHECK_PATHS = ["/api/get-profile-details/", "/api/profile/"]

// Endpoints that never get x-auth-token. Storymedia is excluded on purpose.
const NO_TOKEN_PATHS = ["/api/storymedia/"]

const matchesAny = (config, paths) => paths.some(path => (config?.url || "").includes(path))

// Attach to every axios instance that calls the Mitra backend.
export function attachAuthInterceptors(instance) {
  instance.interceptors.request.use(config => {
    if (matchesAny(config, NO_TOKEN_PATHS)) return config

    const token = getFlowToken(currentFlow())
    if (token) config.headers["x-auth-token"] = token
    return config
  })

  instance.interceptors.response.use(
    response => response,
    error => {
      const tokenSent = !!error?.config?.headers?.["x-auth-token"]
      if (error?.response?.status === 401 && tokenSent && matchesAny(error.config, TOKEN_CHECK_PATHS)) {
        const flow = currentFlow()
        clearFlowToken(flow)
        window.dispatchEvent(new CustomEvent("mitra:auth-expired", { detail: { flow } }))
      }
      return Promise.reject(error)
    }
  )
}