import { getRootPath } from "../../utils/shareMedia"
import ROUTES from "url"
import { useTranslation } from "react-i18next"

export default function TemplateFrame({ html, flow }) {
  // Browser-level link, so the root path is needed here.
  const { t } = useTranslation()
  const startUrl = `${getRootPath()}${ROUTES.SHIKSHAGRAHA_REPOSITORY}?${new URLSearchParams({ flow })}`
  const doc = html.replaceAll("__START_URL__", startUrl)
  return (
    <iframe
      title={t("thankYouFrameTitle")}
      srcDoc={doc}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads allow-top-navigation-by-user-activation"
      allow="web-share; clipboard-write"
      style={{ border: 0, width: "100%", height: "100dvh" }}
    />
  )
}