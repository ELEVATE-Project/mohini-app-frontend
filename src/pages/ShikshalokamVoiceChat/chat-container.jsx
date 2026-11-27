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

const DEVICE_ID_KEY = "mitra_unique_device_id"

// Random ID per browser. Uses randomUUID where available, and falls back for
// non-secure origins (e.g. http://LAN-IP) where randomUUID does not exist.
function createDeviceId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID()

  const bytes = new Uint8Array(16)
  window.crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("")
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

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
  const profileToUse = userStore(state => state.profileId)
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

  // Runs for guest and logged-in users. The ID is only read or created here.
  function getUserFingerPrint() {
    try {
      let currentDeviceId = localStorage.getItem(DEVICE_ID_KEY)
      if (!currentDeviceId) {
        currentDeviceId = createDeviceId()
        localStorage.setItem(DEVICE_ID_KEY, currentDeviceId)
      }
      setDeviceId(currentDeviceId)
      setUserId(`${currentDeviceId.replaceAll("-", "")}@shikshalokam.org`)
    } catch (error) {
      console.error("Error generating device id:", error)
    }
  }

  async function initialSetup() {
    try {
      const customEmail = getDeviceId().replaceAll("-", "") + "@shikshalokam.org"
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

      // Logged-in users always call the profile API, with the token attached by the interceptor.
      // Guests call it only when no profile id is stored yet.
      const shouldFetchProfile = Boolean(accessToken) || !userStore.getState().profileId
      if (shouldFetchProfile) {
        const res = await getProfileDetails(body)
         if (res?.status === "error" && res?.message) {
          // Backend returns status: "error" bodies with 200 on some paths, and 409 on conflicts
          throw Object.assign(new Error(res.message), { status: res.status })
        }
        if (!res?.id) throw new Error("profile call returned no id")
        setProfileId(res.id)
      }

      if (!chatStore.getState().sessionId) {
        const session = await getSessionDetails()
        setSessionId(session.sessionid)
      }

      // Guests only. Logged-in users already have company and name from activateSession.
      if (!accessToken) {
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
      }

      setIsLoading(false)
    } catch (error) {
       console.error("Error during initial setup:", error)
      if (error?.status === 409) {
        console.log("This account is linked to another user. Please contact support.")
      }
      navigate(ROUTES.SHIKSHAGRAHA_REPOSITORY)
      setIsLoading(false)
    }
  }

  const setFinalLanguage = async () => {
    await initialSetup()
    const storedLanguage = chatLanguage || languageList[0].value
    setLanguage(storedLanguage)
  }

  useEffect(() => {
    if (!flowInfo) return

    // Setup is complete only when the Mitra profile id and the chat session both exist.
    // Company name is not enough: logged-in users get it from activateSession before
    // the profile call has run, which previously skipped setup entirely.
    const isSetupComplete = Boolean(profileToUse && sessionId)
    if (isSetupComplete || isSetupInProgressRef.current) {
      if (!ipFetched) setIpFetched(true)
      return
    }

    const runSetup = async () => {
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
  }, [accessToken, sessionId, profileToUse, flowInfo])

  return (
    <>
      {companyName && profileToUse && !isLoading && <DynamicVoiceChat />}
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