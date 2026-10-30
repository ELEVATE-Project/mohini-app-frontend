import { getRootPath } from "../../utils/shareMedia"
import ROUTES from "url"

export default function TemplateFrame({ html, flow }) {
  // Browser-level link, so the root path is needed here.
  const startUrl = `${getRootPath()}${ROUTES.SHIKSHAGRAHA_REPOSITORY}?${new URLSearchParams({ flow })}`
  const doc = html.replaceAll("__START_URL__", startUrl)
  console.log('canShare files:', !!navigator.canShare && navigator.canShare({ files: [new File(['x'], 'a.png', { type: 'image/png' })] }))
  return (
    <iframe
      title="Thank you"
      srcDoc={doc}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads allow-top-navigation-by-user-activation"
      allow="web-share; clipboard-write"
      style={{ border: 0, width: "100%", height: "100dvh" }}
    />
  )
}