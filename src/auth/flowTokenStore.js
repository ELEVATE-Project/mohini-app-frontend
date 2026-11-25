// Per-flow Elevate token storage. Key: mitra_auth:<flow>
// expiresAt comes from the JWT exp claim (seconds), stored in milliseconds.

const TOKEN_PREFIX = "mitra_auth:"
const GUEST_PREFIX = "mitra_guest:"

const tokenKey = flow => `${TOKEN_PREFIX}${flow}`

export function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export function getJwtExpiryMs(token) {
  const claims = decodeJwtPayload(token)
  return typeof claims?.exp === "number" ? claims.exp * 1000 : null
}

export function saveFlowToken(flow, token) {
  const expiresAt = getJwtExpiryMs(token)
  if (!flow || !token || !expiresAt) return false
  localStorage.setItem(tokenKey(flow), JSON.stringify({ token, expiresAt }))
  return true
}

export function getFlowToken(flow) {
  if (!flow) return null
  try {
    const raw = localStorage.getItem(tokenKey(flow))
    if (!raw) return null
    const { token, expiresAt } = JSON.parse(raw)
    if (!token || Date.now() >= expiresAt) {
      localStorage.removeItem(tokenKey(flow))
      return null
    }
    return token
  } catch {
    return null
  }
}

export function clearFlowToken(flow) {
  if (flow) localStorage.removeItem(tokenKey(flow))
}

// For the sidebar logout button. Clears every flow token and guest choice.
export function clearAllFlowTokens() {
  Object.keys(localStorage)
    .filter(key => key.startsWith(TOKEN_PREFIX))
    .forEach(key => localStorage.removeItem(key))
  Object.keys(sessionStorage)
    .filter(key => key.startsWith(GUEST_PREFIX))
    .forEach(key => sessionStorage.removeItem(key))
}

// Guest choice is remembered for the browser tab session only.
export function markGuestChoice(flow) {
  sessionStorage.setItem(`${GUEST_PREFIX}${flow}`, "1")
}

export function hasGuestChoice(flow) {
  return sessionStorage.getItem(`${GUEST_PREFIX}${flow}`) === "1"
}