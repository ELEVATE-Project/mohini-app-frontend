import { API_ENDPOINTS, URL_PARAMS } from "../constants/urls"
import { useChatStorage, useSiteStorage } from "hooks/useStorage"
import { clearFromStorage } from "../services/storage_service"
import { getFlowInfoApi, getFlowLanguagesApi } from "../api/endpoints/flow"
import { getFlowToken, markGuestChoice } from "../auth/flowTokenStore"
import { buildWrapperLoginUrl } from "../auth/wrapperUrl"
import { languageList, languageValueMap } from "../pages/ShikshalokamVoiceChat/enum"
import { sessionFlowName } from "../constants/session"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useSiteDataSessionStore } from "store"
import { useTranslation } from "react-i18next"
import LoginOptions from "./auth/LoginOptions"
import ROUTES from "../url"
import useUrlFlow from "../hooks/useUrlFlow"

// Flows that open their own routes instead of common-chat. The login gate does not
// cover these, so they keep their original behaviour.
const NON_GATED_FLOWS = [sessionFlowName.ParentPerceptionSurvey, sessionFlowName.ListeningActivity]

const LanguageSelectionGrid = ({ usecaseType }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [pendingLanguage, setPendingLanguage] = useState(null)

  const setChatLanguage = useSiteDataSessionStore(state => state.setChatLanguage)
  const setHasSelectedLanguage = useSiteDataSessionStore(state => state.setHasSelectedLanguage)
  const setStorageFlow = useChatStorage()(state => state.setFlow)
  const setPreviousUrl = useSiteStorage()(state => state.setPreviousUrl)

  const { flow: urlFlow } = useUrlFlow()

  const {
    data: flowLanguages,
    isError: isFlowLanguagesError,
    error: flowLanguagesError,
    isLoading: isFlowLanguagesLoading,
  } = useQuery({
    queryKey: [API_ENDPOINTS.FLOW_LANGUAGES, urlFlow],
    queryFn: () => getFlowLanguagesApi(urlFlow),
    retry: false,
    enabled: !!urlFlow && ![sessionFlowName.ParentPerceptionSurvey, sessionFlowName.ListeningActivity].includes(urlFlow),
  })

  const { data: flowInfo } = useQuery({
    queryKey: [API_ENDPOINTS.FLOW_CONNECTION_INFO, urlFlow],
    queryFn: () => getFlowInfoApi(urlFlow),
    enabled: !!urlFlow,
    retry: false,
  })

  useEffect(() => {
    if (!isFlowLanguagesError) return

    if (flowLanguagesError?.response?.status === 404) {
      console.error("Flow not found or inactivate, navigating to home page")
      clearFromStorage()
      navigate(ROUTES.SHIKSHAGRAHA_REPOSITORY, { replace: true })
    }
  }, [flowLanguagesError, isFlowLanguagesError])

  // Opens the chosen flow. Used after language selection, and after Continue as Guest.
  const openFlow = () => {
    if (!urlFlow) return

    const route_mapping = {
      [sessionFlowName.ParentPerceptionSurvey]: ROUTES.SHIKSHAGRAHA_PPPI_VOICE_CHAT,
      [sessionFlowName.ListeningActivity]: ROUTES.SHIKSHAGRAHA_GUEST_LISTENING_CHAT,
    }

    if (route_mapping[urlFlow]) {
      setPreviousUrl(window.location.href)
      setStorageFlow(urlFlow)
      navigate(route_mapping[urlFlow])
      return
    }

    navigate({
      pathname: ROUTES.COMMON_CHAT,
      search: new URLSearchParams({ [URL_PARAMS.FLOW]: urlFlow }).toString(),
    })
  }

  const handleLanguageClick = langValue => {
    setChatLanguage(langValue)

    // Only flows that open common-chat are gated. Other flows behave as before.
    const opensGatedChat = !!urlFlow && !NON_GATED_FLOWS.includes(urlFlow)
    const loginConfig = flowInfo?.login_config
    const needsLogin = opensGatedChat && (loginConfig === "mandatory" || loginConfig === "optional") && !getFlowToken(urlFlow)

    if (needsLogin) {
      if (loginConfig === "mandatory") {
        window.location.href = buildWrapperLoginUrl({ flow: urlFlow, preferredLanguage: langValue })
        return
      }
      // Optional: show Login / Continue as Guest on this screen.
      // Do not set hasSelectedLanguage yet, or this screen would unmount.
      setPendingLanguage(langValue)
      return
    }

    setHasSelectedLanguage(true)
    openFlow()
  }

  const handleContinueAsGuest = () => {
    markGuestChoice(urlFlow)
    setHasSelectedLanguage(true)
    openFlow()
  }

  if (pendingLanguage) {
    return (
      <>
        <div className="text-center text-lg md:text-2xl sm:text-md mt-0 sm:mt-[100px] text-slate-700">
          <b>{t("welcome_text")}</b>
        </div>
        <div className="mt-4 mb-10 px-6 flex justify-center">
          <LoginOptions flow={urlFlow} language={pendingLanguage} onContinueAsGuest={handleContinueAsGuest} />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="text-center text-lg md:text-2xl sm:text-md mt-0 sm:mt-[100px] text-slate-700">
        <b>{t("welcome_text")}</b>
      </div>
      <p className="sm:text-xl text-md font-semibold text-center">{t("languageQuestion")}</p>
      <div className="mt-4 mb-10 grid grid-cols-2 gap-3 md:gap-6 lg:px-[80px] md:px-[20px] sm:px-[20px] px-[10px]">
        {isFlowLanguagesLoading &&
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="div14-lang animate-skeleton m-0 h-[100px]"></div>
          ))}
        {!isFlowLanguagesLoading && flowLanguages &&
          flowLanguages.languages.map((lang, index, arr) => {
            const isLastOdd = arr.length % 2 !== 0 && index === arr.length - 1
            return (
              <div
                key={lang}
                className={`div14-lang m-0 h-[100px] flex items-center justify-center${isLastOdd ? " col-span-2 w-1/2 mx-auto" : ""}`}
                onClick={() => handleLanguageClick(lang)}
              >
                <button className="w-full text-center">{languageValueMap[lang]}</button>
              </div>
            )
          })}
        {!isFlowLanguagesLoading && !flowLanguages &&
          languageList
            .filter(lang => !lang.excludeFor.includes(urlFlow || usecaseType))
            .map((lang, index, arr) => {
              const isLastOdd = arr.length % 2 !== 0 && index === arr.length - 1
              return (
                <div
                  key={lang.value}
                  className={`div14-lang m-0 h-[100px] flex items-center justify-center${isLastOdd ? " col-span-2 w-1/2 mx-auto" : ""}`}
                  onClick={() => handleLanguageClick(lang.value)}
                >
                  <button className="w-full text-center">{lang.label}</button>
                </div>
              )
            })}
      </div>
    </>
  )
}

export default LanguageSelectionGrid