import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useChatDataLocalStore, useChatDataSessionStore } from "store"
import { getTemplateDetails } from "../../utils/shareMedia"
import TemplateFrame from "./TemplateFrame"
import ThankYouLoader from "./ThankYouLoader"

export default function ThankYouPage() {
  const { templateId } = useParams()
  const [params] = useSearchParams()
  const language = (params.get("language") || "en").toLowerCase()
  const flow = params.get("flow") || ""
  const [state, setState] = useState({ status: "loading", html: "" })

  useEffect(() => {
    useChatDataLocalStore.setState(useChatDataLocalStore.getInitialState(), true)
    useChatDataSessionStore.setState(useChatDataSessionStore.getInitialState(), true)
  }, [])

  useEffect(() => {
    let cancelled = false

    getTemplateDetails(templateId, language)
      .then(data => {
        if (cancelled) return
        setState(data?.html ? { status: "ok", html: data.html } : { status: "fallback", html: "" })
      })
      .catch(() => {
        if (!cancelled) setState({ status: "fallback", html: "" })
      })

    return () => {
      cancelled = true
    }
  }, [templateId, language])

  if (state.status === "loading") return <ThankYouLoader />
  if (state.status === "fallback") return <p>Thank you, your response is submitted.</p>

  return <TemplateFrame html={state.html} flow={flow} />
}