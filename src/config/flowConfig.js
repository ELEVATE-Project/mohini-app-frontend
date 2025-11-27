import { sessionFlowName } from "../pages/ShikshalokamVoiceChat/enum"
import ROUTES from "../url"
import ptmQuestions from "../services/const/questions/ptmQuestions"
import ylcQuestions, { ylcStoryTextAudio } from "../services/const/questions/ylcQuestions"
import env from "../utils/env"

const base_path = env.AUDIO_PATH()

export const FLOW_CONFIG = {
  [sessionFlowName.megaPTM]: {
    flowName: sessionFlowName.megaPTM,
    questions: ptmQuestions,
    homePageRoute: ROUTES.SHIKSHALOKAM_PTM_HOME_PAGE,
    chatRoute: ROUTES.SHIKSHALOKAM_PTM_CHAT_PAGE,
    profileId: env.MEGA_PTM_PROFILE_ID(),
    apiRoute: "/mega_ptm",
    completionMessageKey: "ptmCompletionMessage",
    completionCTAKey: "ptmCompletionCTA",
    introHeadingKey: "ptmIntroductionHeading",
    uploadPhotoKey: "evidence'",
    introLines: ["ptmIntroductionDescriptionLine1", "ptmIntroductionDescriptionLine2", "ptmIntroductionDescriptionLine3"],
    showCompletionPopup: true,
    storyActions: {
      showPhotoUpload: false,
      showEdit: false,
      showDownload: false,
    },
  },
  [sessionFlowName.YLC]: {
    flowName: sessionFlowName.YLC,
    questions: ylcQuestions,
    homePageRoute: ROUTES.SHIKSHALOKAM_YLC_HOME_PAGE,
    chatRoute: ROUTES.SHIKSHALOKAM_YLC_CHAT_PAGE,
    profileId: env.YLC_PROFILE_ID(),
    apiRoute: "/ylc",
    completionMessageKey: "ptmCompletionMessage",
    completionCTAKey: "ptmCompletionCTA",
    introHeadingKey: "homepageHeading",
    introHeadingKey1: "homepageHeading1",
    introLines: ["homepageList", "homepageList1", "homepageList2"],
    uploadPhotoKey: "evidenceStory",
    showCompletionPopup: false,
    storyActions: {
      showPhotoUpload: true,
      showEdit: true,
      showDownload: true,
    },
    storyTextAudio: ylcStoryTextAudio,
  },
}

export const getFlowConfig = flowType => {
  const config = FLOW_CONFIG[flowType]
  if (!config) {
    throw new Error(`Flow configuration not found for: ${flowType}`)
  }
  return config
}

export const FLOW_CONFIG_V2 = {
  [sessionFlowName.SchoolSurvey]: {
    chatHeading: "{homepageHeading}\n{homepageHeading1}",
    chatDescription: `1. {homepageList}\n2. {homepageList1}\n3. {homepageList2}`,
    imageUploadLimit: 10,
    postChatConfig: {
      allowImageUpload: true,
      imageUploadLimit: 10,
      displayEditStory: true,
    },
  },
}

/**
 * Extracts variable placeholders from a string
 * @param {string} text - The text containing variable placeholders in the format {variableName}
 * @returns {string[]|null} An array of matched variables (e.g., ["{homepageHeading}", "{homepageList}"]) or null if no matches found
 * @example
 * getStringVariables("Hello {name}, welcome to {place}")
 */
export const getStringVariables = text => {
  return text.match(/{(\w+)}/g)
}

export const processStringSubstitution = (text, obj) => {
  return text.replace(/{(\w+)}/g, (match, key) => obj[key] || match)
}
