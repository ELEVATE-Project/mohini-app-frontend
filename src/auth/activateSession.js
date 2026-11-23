import { LANGUAGE_ENUMS } from "../pages/ShikshalokamVoiceChat/enum"
import { clearFromStorage } from "../services/storage_service"
import { setLanguage } from "../i18n"
import { useSiteDataSessionStore, useUserDataLocalStore, useChatDataLocalStore } from "../store"

// Makes the verified Elevate login the one this tab uses.
//
// Language: wrapper preferred_language, else the language the user already selected, else English.
// Profile: never taken from the wrapper profile. The Mitra profile id is set by
// ChatContainer.initialSetup from /api/profile/, and is cleared here on a fresh login.
// Session: not created here. ChatContainer creates it when profileId is missing.
export function activateSession({ flow, token, profile, language, fresh = false }) {
  // Read before clearFromStorage(), which resets the site store.
  const selectedLanguage = useSiteDataSessionStore.getState().chatLanguage
  const chatLanguage = language || selectedLanguage || LANGUAGE_ENUMS.ENGLISH

  const chatBefore = useChatDataLocalStore.getState()
  const needsNewSession = fresh || !chatBefore.sessionId || chatBefore.flow !== flow
  if (needsNewSession) clearFromStorage()

  const user = useUserDataLocalStore.getState()
  user.setAccessToken(token)
  if (needsNewSession) user.setProfileId(null)
  user.setFirstName(profile?.name || "")
  user.setCompanyName(profile?.organizations?.[0]?.code || "")
  user.setState(profile?.state?.label || "")
  user.setAcceptedTnC(true)

  const chat = useChatDataLocalStore.getState()
  chat.setFlow(flow)
  chat.setIsNewChatOpen(true)

  // Needed so LanguageGuard lets the chat route render.
  const site = useSiteDataSessionStore.getState()
  site.setChatLanguage(chatLanguage)
  site.setHasSelectedLanguage(true)
  setLanguage(chatLanguage)
}