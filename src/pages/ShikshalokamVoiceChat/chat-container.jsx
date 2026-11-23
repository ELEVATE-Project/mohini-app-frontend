import { API_ENDPOINTS } from "../../constants/urls"
import { BiLoader } from "react-icons/bi"
import { getFlowInfoApi, loginApi } from "../../api/endpoints"
import { getIpLocation, getProfileDetails, getSessionDetails } from "../../services/api.service"
import { languageList } from "./enum"
import { setLanguage } from "../../i18n"
import { useChatStorage, useUserStorage } from "../../hooks/useStorage"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useSiteDataSessionStore } from "store"
import DynamicVoiceChat from "./dynamic-voice-chat"
import ROUTES from "../../url"
import useSmartChatStorage from "../../hooks/useSmartChatStorage"
import useUrlFlow from "../../hooks/useUrlFlow"
import useUserDataLocalStore from "../../store/slices/userData/userDataLocal"

function ChatContainer() {
  const navigate = useNavigate()
  const { flow: urlFlow } = useUrlFlow()

  const [isLoading, setIsLoading] = useState(false)
  const isSetupInProgressRef = useRef(false)
  const userStore = useUserStorage()
  const chatStore = useChatStorage()
  const { setFirstName } = userStore.getState()

  const chatLanguage = useSiteDataSessionStore(state => state.chatLanguage)
  const companyName = userStore(state => state.companyName)
  const deviceId = userStore(state => state.device_id)
  const getDeviceId = userStore(state => state.getDeviceId)
  const ipCity = userStore(state => state.ipCity)
  const ipCountry = userStore(state => state.ipCountry)
  const ipFetched = userStore(state => state.ipFetched)
  const ipState = userStore(state => state.ipState)
  const sessionId = chatStore(state => state.sessionId)
  const setCompanyName = userStore(state => state.setCompanyName)
  const setDeviceId = userStore(state => state.setDeviceId)
  const setIpCity = userStore(state => state.setIpCity)
  const setIpCountry = userStore(state => state.setIpCountry)
  const setIpFetched = userStore(state => state.setIpFetched)
  const setIpState = userStore(state => state.setIpState)
  const setIpZipCode = userStore(state => state.setIpZipCode)
  const setIsNewChatOpen = chatStore(state => state.setIsNewChatOpen)
  const setProfileId = userStore(state => state.setProfileId)
  const setSessionId = chatStore(state => state.setSessionId)
  const setUserId = userStore(state => state.setUserId)

  const [chatHistory, setChatHistory, removeChatHistory, getChatHistory] = useSmartChatStorage()

  const accessToken = useUserDataLocalStore(state => state.access_token)

  const { data: flowInfo } = useQuery({
    queryKey: [API_ENDPOINTS.FLOW_CONNECTION_INFO, urlFlow],
    queryFn: () => getFlowInfoApi(urlFlow),
    // staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    const chat_history = getChatHistory()
    const updated_chat_history = chat_history.filter(chat => chat.received)
    setChatHistory(updated_chat_history)
  }, [])

  function getUserFingerPrint() {
    if (accessToken) return

    try {
      const fingerprint = window.navigator.userAgent + window.navigator.language + window.screen.colorDepth + window.screen.pixelDepth + window.screen.width + window.screen.height

      const newUserId = deviceId || btoa(fingerprint)

      if (!deviceId) setDeviceId(newUserId)
      setUserId(newUserId)
    } catch (error) {
      console.error("Error handling user ID:", error)
      setUserId("guest_" + Date.now())
    }
  }

  async function initialSetup() {
    if (accessToken) return

    try {
      const customEmail = getDeviceId() + "@shikshalokam.org"
      const body = {
        email: customEmail,
        company: "shikshalokamstaging",
        password: "grit@123",
        latest_flow: urlFlow,
        other_params: {
          device_id: getDeviceId(),
          city: ipCity || "",
          state: ipState || "",
          country: ipCountry || "",
        },
      }

      setIsLoading(true)
      const res = await getProfileDetails(body)

      setProfileId(res.id)

      let session = await getSessionDetails()
      setSessionId(session.sessionid)

      const response = await loginApi({
        email: customEmail,
        password: "grit@123",
      })

      if (response?.access_token) {
        setCompanyName(response?.company)
        setFirstName(response?.first_name)
      } else {
        window.location.reload()
      }

      setIsLoading(false)
    } catch (error) {
      console.warn("Error during initial setup, using fallback for mock/local:", error)
      if (import.meta.env.DEV) {
        setCompanyName("shikshalokamstaging")
        const currentProfileId = userStore.getState().profileId
        if (!currentProfileId) {
          setProfileId("mock_profile_" + Date.now())
        }
        const currentSessionId = chatStore.getState().sessionId
        if (!currentSessionId) {
          setSessionId("mock_session_" + Date.now())
        }
      } else {
        navigate(ROUTES.SHIKSHAGRAHA_REPOSITORY)
      }
      setIsLoading(false)
    }
  }

  const setFinalLanguage = async () => {
    if (accessToken) return

    await initialSetup()
    const storedLanguage = chatLanguage || languageList[0].value
    setLanguage(storedLanguage)
  }

  useEffect(() => {
    if (!flowInfo) return

    const runSetup = async () => {
      const currentSession = chatStore.getState().sessionId
      if (currentSession || isSetupInProgressRef.current) return

      try {
        isSetupInProgressRef.current = true
        setIsLoading(true)
        setIsNewChatOpen(true)

        const locationData = await getIpLocation()
        if (locationData && locationData?.location) {
          setIpState(locationData?.location?.regionName)
          setIpCity(locationData?.location?.city)
          setIpCountry(locationData?.location?.country)
          setIpZipCode(locationData?.location?.zip)
        }
        getUserFingerPrint()
        await setFinalLanguage()
      } finally {
        isSetupInProgressRef.current = false
        setIpFetched(true)
        setIsLoading(false)
      }
    }

    setIpFetched(false)
    runSetup()
  }, [accessToken, sessionId, flowInfo])

  return (
    <>
      {companyName && !isLoading && <DynamicVoiceChat />}
      {(isLoading || (!ipFetched && !companyName)) && (
        <div className="loader-load-spinner">
          <div className="div67">
            <BiLoader className="loader-rotate-loader loader-icon" />
          </div>
        </div>
      )}
    </>
  )
}

export default ChatContainer
