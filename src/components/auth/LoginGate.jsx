import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FaArrowLeftLong } from "react-icons/fa6"
import LanguageSelector from "../LanguageSelector"
import LoginOptions from "./LoginOptions"
import ROUTES from "../../url"
import { useSiteDataSessionStore } from "../../store"

// TODO: move to translation.json once the key is agreed
const MITRA_TITLE = "Mitra: Amplifying Voices, Capturing Impact"
const ILLUSTRATION = "https://mohini-static.shikshalokam.org/fe-images/PNG/Shikshalokam/innovationpana-1@2x.png"

export default function LoginGate({ flow, onContinueAsGuest }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)

  return (
    <div className="min-h-screen w-full overflow-x-hidden grid md:grid-cols-2 bg-white">
      {/* Left panel: web only */}
      <section className="hidden md:flex flex-col px-10 py-6 min-w-0">
        <img src={t("pageLogo")} alt="shikshagraha" className="h-[60px] w-[200px] object-contain object-left" />
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <h1 className="text-center text-xl font-semibold text-slate-800">{MITRA_TITLE}</h1>
          <img src={ILLUSTRATION} alt="" className="w-[360px] max-w-full h-auto" />
        </div>
      </section>

      {/* Right panel: full screen on mobile */}
      <section className="flex flex-col min-h-screen min-w-0 bg-white md:bg-[#f8f9fc]">
        {/* Top row: back button (mobile only) and language selector in a fixed-width box */}
        <div className="flex items-center justify-between gap-2 px-4 pt-4 md:justify-end md:px-8">
          <button
            type="button"
            onClick={() => navigate(ROUTES.SHIKSHAGRAHA_REPOSITORY)}
            aria-label="Back"
            className="p-2 shrink-0 md:hidden"
          >
            <FaArrowLeftLong />
          </button>
          <div className="w-[150px] shrink-0">
            <LanguageSelector fluid />
          </div>
        </div>

        {/* Mobile only: title and illustration centred above the buttons */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 md:hidden">
          <h1 className="text-center text-lg font-semibold text-slate-800">{MITRA_TITLE}</h1>
          <img src={ILLUSTRATION} alt="" className="w-[60%] max-w-[260px] h-auto object-contain" />
        </div>

        {/* Buttons: pinned to the bottom on mobile, centred on web */}
        <div className="px-5 pb-8 md:flex md:flex-1 md:flex-col md:justify-center md:px-8 md:pb-0">
          <LoginOptions flow={flow} language={chatLanguage} onContinueAsGuest={onContinueAsGuest} />
        </div>
      </section>
    </div>
  )
}