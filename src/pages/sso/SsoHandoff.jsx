import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { BiLoader } from "react-icons/bi"
import ROUTES from "../../url"
import { URL_PARAMS } from "../../constants/urls"
import { LANGUAGE_ENUMS } from "../ShikshalokamVoiceChat/enum"
import { activateSession } from "../../auth/activateSession"
import { clearFlowToken, getFlowToken, saveFlowToken } from "../../auth/flowTokenStore"
import { verifyElevateToken } from "../../auth/verifyElevateToken"
import { clearFromStorage } from "../../services/storage_service"

const SUPPORTED_LANGUAGES = Object.values(LANGUAGE_ENUMS)

// Return from the Elevate wrapper: /sso-mitra?flow=&accToken=&preferred_language=
function SsoHandoff() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!failed) return
    const timer = setTimeout(() => navigate(ROUTES.SHIKSHAGRAHA_REPOSITORY, { replace: true }), 2500)
    return () => clearTimeout(timer)
  }, [failed])

  useEffect(() => {
    const flow = searchParams.get(URL_PARAMS.FLOW)
    const token = searchParams.get(URL_PARAMS.ACCESS_TOKEN)
    const requested = searchParams.get("preferred_language")
    const language = SUPPORTED_LANGUAGES.includes(requested) ? requested : undefined

    console.log("[sso] start", { flow, hasToken: !!token, requested, language })

    async function run() {
      // Use the token from the URL if present, otherwise the one already stored for this flow
      const activeToken = token || getFlowToken(flow)
      if (!activeToken) throw new Error("No token in URL or storage")
      if (token) saveFlowToken(flow, token)
      console.log("[sso] token saved", { fromUrl: !!token })

      const profile = await verifyElevateToken(activeToken)
      console.log("[sso] verified", { name: profile?.name })

      await activateSession({ flow, token: activeToken, profile, language, fresh: false })
      console.log("[sso] session activated")

      navigate(`${ROUTES.COMMON_CHAT}?flow=${encodeURIComponent(flow)}`, { replace: true })
      console.log("[sso] navigated to common-chat")
    }

    run().catch(error => {
      console.error("[sso] FAILED", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        stack: error?.stack,
      })
      clearFlowToken(flow)
      clearFromStorage()
      setFailed(true)
    })
  }, [])

  if (failed) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-2 text-slate-700">
        <p className="text-xl font-semibold">Login failed</p>
        <p className="text-sm">Redirecting you to the home page…</p>
      </div>
    )
  }

  return (
    <div className="loader-load-spinner">
      <div className="div67">
        <BiLoader className="loader-rotate-loader loader-icon" />
      </div>
    </div>
  )
}

export default SsoHandoff