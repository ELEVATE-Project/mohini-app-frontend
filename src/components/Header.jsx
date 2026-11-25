import { useTranslation } from "react-i18next"
import { FaArrowLeftLong } from "react-icons/fa6"
import LanguageSelector from "./LanguageSelector"
import useSiteDataSessionStore from "store/slices/siteData/siteDataSession"

const DEFAULT_IMAGE = "https://mohini-static.shikshalokam.org/fe-images/PNG/Shikshalokam/innovationpana-1@2x.png"

// title, image and onBack are optional. With none passed, output matches the original header.
const Header = ({
  languageButtonSelect,
  isDesktop = false,
  title,
  image,
  onBack,
  mobileImageClassName
}) => {
  const { t } = useTranslation()

  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)
  const heading = title ?? t("welcome_heading1")
  const imageSrc = image ?? DEFAULT_IMAGE
  const showLanguage = !!languageButtonSelect && ![null, ""].includes(languageButtonSelect)

  if (isDesktop) {
    return (
      <>
        {/* Fixed-width box so the fluid selector cannot run off the right edge */}
        {showLanguage && (
          <div className="absolute top-6 right-6 hidden w-[120px] sm:block">
            <LanguageSelector fluid />
          </div>
        )}

        {/* Left panel: logo at the top, title and illustration centred in the remaining space */}
        <div className="hidden sm:flex flex-col min-h-screen px-10 py-6 min-w-0">
          <div className="flex">
            <img src={t("pageLogo")} className="h-[100px] w-[200px] object-contain aspect-auto align-top object-[center_center] relative ml-0" alt="shikshalokam_logo" />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className="text-center text-xl font-semibold text-slate-800">
              <b>{heading}</b>
            </div>
            <img src={imageSrc} alt="" className="w-[420px] max-w-full h-auto object-contain" />
          </div>
        </div>
      </>
    )
  }

  const isSpread = !!onBack || showLanguage

  return (
    <>
      <div className="justify-center w-full flex sm:hidden">
        <div className="w-full">
          <div className={`${isSpread ? "justify-between" : "justify-center"} w-full flex sm:hidden items-center gap-2 px-4 py-3`}>
            {onBack && (
              <button type="button" onClick={onBack} aria-label="Back" className="p-2 shrink-0">
                <FaArrowLeftLong />
              </button>
            )}
            <img src={t("pageLogo")} className={`h-[50px] object-contain ${chatLanguage === "en" ? "w-[140px]" : "w-[100px]"}`} alt="shikshalokam_logo" />
            {showLanguage && (
              <div className="w-[120px] shrink-0">
                <LanguageSelector fluid />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:hidden px-6 pt-2 text-center text-lg font-semibold text-slate-800">
        <b>{heading}</b>
      </div>

      <img
        src={imageSrc}
        alt=""
        className={mobileImageClassName || "block mx-auto my-4 w-[60%] max-w-[260px] h-auto object-contain sm:hidden"}
      />
    </>
  )
}

export default Header