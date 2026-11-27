import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { BiLoader } from "react-icons/bi"
import { getFlowInfoApi } from "../../api/endpoints"
import { URL_PARAMS } from "../../constants/urls"
import { useSiteDataSessionStore } from "../../store"
import { clearFlowToken, getFlowToken, hasGuestChoice, markGuestChoice } from "../../auth/flowTokenStore"
import { verifyElevateToken } from "../../auth/verifyElevateToken"
import { activateSession } from "../../auth/activateSession"
import { buildWrapperLoginUrl } from "../../auth/wrapperUrl"
import LoginGate from "./LoginGate"
import { useUserDataLocalStore } from "../../store"
// Wraps COMMON_CHAT and decides, per flow, whether chat may render.
// not_required (or flow info unavailable): chat renders as before (guest path).
// Valid token: verify, activate session, render chat.
// mandatory without token: redirect to the wrapper.
// optional without token: show LoginGate (Login or Continue as Guest).
export default function AuthGate({ children }) {
  const [searchParams] = useSearchParams()
  const flow = searchParams.get(URL_PARAMS.FLOW)
  const [reloadKey, setReloadKey] = useState(0)
  const [gate, setGate] = useState({ status: "loading" })

  // Fired by the axios interceptor when a stored token is rejected with 401
  useEffect(() => {
    const onExpired = event => {
      if (event.detail?.flow === flow) setReloadKey(key => key + 1)
    }
    window.addEventListener("mitra:auth-expired", onExpired)
    return () => window.removeEventListener("mitra:auth-expired", onExpired)
  }, [flow])

  useEffect(() => {
    if (!flow) {
      setGate({ status: "ready" })
      return
    }

    let cancelled = false
    setGate({ status: "loading" })

   async function resolve() {
  let loginConfig
  try {
    const info = await getFlowInfoApi(flow)
    loginConfig = info?.login_config
  } catch {
    return { status: "ready" }
  }

  if (!loginConfig || loginConfig === "not_required") {
    useUserDataLocalStore.getState().setAccessToken(null)
    return { status: "ready" }
  }

  const token = getFlowToken(flow)
  if (token) {
    try {
      const profile = await verifyElevateToken(token)
      await activateSession({ flow, token, profile })
      return { status: "ready" }
    } catch (error) {
      if (error?.response?.status === 401) clearFlowToken(flow)
    }
  }

  useUserDataLocalStore.getState().setAccessToken(null)
  if (loginConfig === "mandatory") return { status: "redirect" }
  if (hasGuestChoice(flow)) return { status: "ready" }
  return { status: "login" }
}

    resolve().then(next => {
      if (cancelled) return
      if (next.status === "redirect") {
        const preferredLanguage = useSiteDataSessionStore.getState().chatLanguage
        window.location.href = buildWrapperLoginUrl({ flow, preferredLanguage })
        return
      }
      setGate(next)
    })

    return () => {
      cancelled = true
    }
  }, [flow, reloadKey])

  if (gate.status === "loading" || gate.status === "redirect") {
    return (
      <div className="loader-load-spinner">
        <div className="div67">
          <BiLoader className="loader-rotate-loader loader-icon" />
        </div>
      </div>
    )
  }

  if (gate.status === "login") {
    return (
      <LoginGate
        flow={flow}
        onContinueAsGuest={() => {
          markGuestChoice(flow)
          setGate({ status: "ready" })
        }}
      />
    )
  }

  return children
}