import { useMemo } from "react"
import { getRootPath } from "../../utils/shareMedia"
import ROUTES from "url"
import { useTranslation } from "react-i18next"

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

export default function TemplateFrame({ html, flow }) {
  const { t } = useTranslation()
  const startUrl = `${getRootPath()}${ROUTES.SHIKSHAGRAHA_REPOSITORY}?${new URLSearchParams({ flow })}`
  const doc = html.replaceAll("__START_URL__", startUrl)

  const sandbox = useMemo(() => {
    const base = "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads allow-top-navigation-by-user-activation"
    // iOS needs allow-same-origin for share to work; Android works without it.
    return isIOS() ? `allow-same-origin ${base}` : base
  }, [])

  return (
    <iframe
      title={t("SuccessfullySubmittedMessage")}
      srcDoc={doc}
      sandbox={sandbox}
      allow="web-share; clipboard-write"
      style={{ border: 0, width: "100%", height: "100dvh" }}
    />
  )
}