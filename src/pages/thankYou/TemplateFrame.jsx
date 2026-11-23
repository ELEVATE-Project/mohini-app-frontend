import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { getRootPath } from "../../utils/shareMedia"
import { isIOS } from "../../utils/helpers"
import ROUTES from "url"

const BASE_SANDBOX =
  "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads allow-top-navigation-by-user-activation"

export default function TemplateFrame({ html, flow }) {
  const { t } = useTranslation()
  const startUrl = `${getRootPath()}${ROUTES.SHIKSHAGRAHA_REPOSITORY}?${new URLSearchParams({ flow })}`
  const doc = html.replaceAll("__START_URL__", startUrl)

  // iOS needs allow-same-origin for share to work; Android works without it.
  const sandbox = useMemo(
    () => (isIOS() ? `allow-same-origin ${BASE_SANDBOX}` : BASE_SANDBOX),
    []
  )

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