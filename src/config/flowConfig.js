import { sessionFlowName } from "../constants/session"
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
    completionMessageKey: "popup:ptmCompletionMessage",
    completionCTAKey: "popup:ptmCompletionCTA",
    introHeadingKey: "homepage:ptmIntroductionHeading",
    uploadPhotoKey: "media:evidence'",
    introLines: ["homepage:ptmIntroductionDescriptionLine1", "homepage:ptmIntroductionDescriptionLine2", "homepage:ptmIntroductionDescriptionLine3"],
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
    completionMessageKey: "popup:ptmCompletionMessage",
    completionCTAKey: "popup:ptmCompletionCTA",
    introHeadingKey: "homepage:homepageHeading",
    introHeadingKey1: "homepage:homepageHeading1",
    introLines: ["homepage:homepageList", "homepage:homepageList1", "homepage:homepageList2"],
    uploadPhotoKey: "media:evidenceStory",
    showCompletionPopup: false,
    storyActions: {
      showPhotoUpload: true,
      showEdit: true,
      showDownload: true,
    },
    storyTextAudio: ylcStoryTextAudio,
  },
  [sessionFlowName.GuestDiscussion]: {
    flowName: sessionFlowName.GuestDiscussion,
    storyActions: {
      downloadReportText: "dynamic_chat:reDownloadReportText",
    },
  },
  [sessionFlowName.ListeningActivity]: {
    flowName: sessionFlowName.ListeningActivity,
    storyActions: {
      downloadReportText: "dynamic_chat:reDownloadReportText",
    },
  },
  [sessionFlowName.LoginDiscussion]: {
    flowName: sessionFlowName.LoginDiscussion,
    storyActions: {
      downloadReportText: "dynamic_chat:reDownloadReportText",
    },
  },
}

export const getFlowConfig = flowType => {
  const config = FLOW_CONFIG[flowType]
  if (!config) {
    throw new Error(`Flow configuration not found for: ${flowType}`)
  }
  return config
}
