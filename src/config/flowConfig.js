import { sessionFlowName } from "../pages/ShikshalokamVoiceChat/enum";
import ROUTES from "../url";
import ptmQuestions from "../services/const/questions/ptmQuestions";
import ylcQuestions, { ylcStoryTextAudio } from "../services/const/questions/ylcQuestions";
import env from "../utils/env";
import { bot_routes, bot_websocket } from "../configure";

const base_path = env.AUDIO_PATH();

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
};

export const getFlowConfig = flowType => {
  const config = FLOW_CONFIG[flowType];
  if (!config) {
    throw new Error(`Flow configuration not found for: ${flowType}`);
  }
  return config;
};

export const FLOW_CONFIG_V2 = {
  [sessionFlowName.SchoolSurvey]: {
    chatHeading: "{homepageHeading}",
    chatDescription: `1. {homepageList}\n`,
    imageUploadLimit: 10,
    completionMessageKey: "ptmCompletionMessage",
    completionCTAKey: "flowCompletionReturn",
    introHeadingKey: "ptmIntroductionHeading",
    postChatConfig: {
      allowImageUpload: true,
      imageUploadLimit: 10,
      displayEditStory: true,
      generateStory: false,
    },
  },
};

export const FLOW_TO_WEB_ROUTE_MAP = {
  [sessionFlowName.GuestDiscussion]: ROUTES.SHIKSHALOKAM_GUEST_VOICE_CHAT,
  [sessionFlowName.GuestMiStory]: ROUTES.SHIKSHALOKAM_GUEST_MI_STORY,
  [sessionFlowName.SchoolSurvey]: ROUTES.AP_SCHOOL_SURVEY,
  [sessionFlowName.ListeningActivity]: ROUTES.SHIKSHALOKAM_GUEST_LISTENING_CHAT,
};

export const FLOW_TO_ROUTE_MAP = {
  [sessionFlowName.GuestDiscussion]: bot_routes.shikshalokam_chaupal,
  [sessionFlowName.LoginDiscussion]: bot_routes.shikshalokam_chaupal,
  [sessionFlowName.ListeningActivity]: bot_routes.listening_activity,
  [sessionFlowName.GuestMiStory]: {
    normal: bot_routes.normal,
    oneshot: bot_routes.oneshot,
  },
  [sessionFlowName.SchoolSurvey]: bot_routes.school_survey,
};

export const FLOW_TO_WEBSOCKET_MAP = {
  [sessionFlowName.GuestDiscussion]: bot_websocket.shikshalokam_chaupal,
  [sessionFlowName.LoginDiscussion]: bot_websocket.shikshalokam_chaupal,
  [sessionFlowName.ListeningActivity]: bot_websocket.listening_activity,
  [sessionFlowName.GuestMiStory]: {
    normal: bot_websocket.normal,
    oneshot: bot_websocket.oneshot,
  },
  [sessionFlowName.SchoolSurvey]: bot_websocket.listening_activity,
};

export const getWebSocketUrlFromSession = (sessionName, selectedType = undefined) => {
  if (!FLOW_TO_WEBSOCKET_MAP[sessionName]) return null;
  if (typeof FLOW_TO_WEBSOCKET_MAP[sessionName] === "string") return FLOW_TO_WEBSOCKET_MAP[sessionName];
  if (selectedType && FLOW_TO_WEBSOCKET_MAP[sessionName][selectedType]) return FLOW_TO_WEBSOCKET_MAP[sessionName][selectedType];
  return bot_routes.reflection;
};

export const getRouteFromSession = (sessionName, selectedType = undefined) => {
  if (!FLOW_TO_ROUTE_MAP[sessionName]) return null;
  if (typeof FLOW_TO_ROUTE_MAP[sessionName] === "string") return FLOW_TO_ROUTE_MAP[sessionName];
  if (selectedType && FLOW_TO_ROUTE_MAP[sessionName][selectedType]) return FLOW_TO_ROUTE_MAP[sessionName][selectedType];
  return bot_routes.reflection;
};
/**
 * Extracts variable placeholders from a string
 * @param {string} text - The text containing variable placeholders in the format {variableName}
 * @returns {string[]|null} An array of matched variables (e.g., ["{homepageHeading}", "{homepageList}"]) or null if no matches found
 * @example
 * getStringVariables("Hello {name}, welcome to {place}")
 */
export const getStringVariables = text => {
  return text.match(/{(\w+)}/g);
};

/**
 * Replaces variable placeholders in a string with corresponding values from an object
 * @param {string} text - The text containing variable placeholders in the format {variableName}
 * @param {Object} obj - An object containing key-value pairs for substitution
 * @returns {string} The text with all placeholders replaced by their corresponding values from the object
 * @example
 * processStringSubstitution("Hello {name}, welcome to {place}", { name: "John", place: "Paris" })
 * // Returns: "Hello John, welcome to Paris"
 */
export const processStringSubstitution = (text, obj) => {
  return text.replace(/{(\w+)}/g, (match, key) => obj[key] || match);
};
