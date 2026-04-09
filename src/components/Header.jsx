// components/Header.js
import { useTranslation } from "react-i18next"
import LanguageSelector from "./LanguageSelector"
import useSiteDataSessionStore from "store/slices/siteData/siteDataSession"

const Header = ({
  // userLanguage,
  languageButtonSelect,
  // onLanguageChange,
  isDesktop = false,
  isLoading = false,
}) => {
  const { t } = useTranslation()

  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)

  if (isDesktop) {
    return (
      <>
        {/* Desktop Language Selector */}
        <LanguageSelector
          // userLanguage={userLanguage}
          // onLanguageChange={onLanguageChange}
          className="absolute top-6 right-6 hidden sm:block"
          isVisible={!!languageButtonSelect}
        />

        {/* Desktop Header */}
        <div className="px-5 hidden sm:block">
          {isLoading ? (
            <>
              <div className="flex items-center gap-3">
                <div className="animate-skeleton h-12 w-12 rounded-full"></div>
                <div className="animate-skeleton h-5 w-40 rounded"></div>
              </div>
              <div className="mt-[40px] flex flex-col items-center gap-2">
                <div className="animate-skeleton h-5 w-48 rounded"></div>
                <div className="animate-skeleton h-5 w-36 rounded"></div>
              </div>
              <div className="animate-skeleton mt-6 w-[360px] h-[300px] rounded-xl center-img"></div>
            </>
          ) : (
            <>
              <div className="flex">
                <img src={t("pageLogo")} className="h-[100px] w-[200px] object-contain aspect-auto align-top object-[center_center] relative ml-0" alt="shikshalokam_logo" />
              </div>
              <div className="mt-[40px]">
                <div className="text-center sm:text-md text-xl mb-2 text-slate-700">
                  <b>{t("welcome_heading1")}</b>
                </div>
              </div>
              <img src="https://mohini-static.shikshalokam.org/fe-images/PNG/Shikshalokam/innovationpana-1@2x.png" width="360" height="300" className="center-img custom-login-image" alt="" />
            </>
          )}
        </div>
      </>
    )
  }

  // Mobile Header
  return (
    <>
      <div className="justify-center w-full flex sm:hidden">
        <div className="w-full">
          <div className={`${languageButtonSelect && ![null, ""].includes(languageButtonSelect) ? "justify-between" : "justify-center"} w-full flex sm:hidden items-center p-2`}>
            <img src={t("pageLogo")} className={`h-[50px] object-contain ${chatLanguage === "en" ? "w-[140px]" : "w-[100px]"}`} alt="shikshalokam_logo" />
            <LanguageSelector
              // userLanguage={userLanguage}
              // onLanguageChange={onLanguageChange}
              className="w-[140px] flex justify-end p-2"
              isVisible={languageButtonSelect && ![null, ""].includes(languageButtonSelect)}
            />
          </div>
        </div>
      </div>
      <div className="sm:hidden text-center sm:text-sm mb-1 text-md text-slate-700">
        <b>{t("welcome_heading1")}</b>
      </div>
      <img src="https://mohini-static.shikshalokam.org/fe-images/PNG/Shikshalokam/innovationpana-1@2x.png" width="170" height="100" className="center-img custom-login-image sm:hidden" alt="" />
    </>
  )
}

export default Header
