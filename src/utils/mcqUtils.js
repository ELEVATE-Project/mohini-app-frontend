import { STATE_MACHINE_OPERATION_TYPE } from "../constants/session"

/**
 * Evaluates whether a backend API response is eligible for Multiple Choice Questions (MCQ) rendering.
 * Mandatory Conditions:
 * 1. response?.operation_type === "non_llm"
 * 2. response?.validations?.type === "MULTIPLE_CHOICE"
 *
 * If either condition is not met, returns false.
 *
 * @param {Object|null|undefined} response - The API response object
 * @returns {boolean} True if eligible, false otherwise
 */
export const isMCQEligible = response => {
  if (!response || typeof response !== "object") return false
  return (
    response.operation_type === STATE_MACHINE_OPERATION_TYPE.NON_LLM &&
    response.validations?.type === "MULTIPLE_CHOICE"
  )
}

/**
 * Extracts the appropriate question text from a bot response according to priority:
 * 1. translated_bot_question, when non-empty string for active language
 * 2. first_bot_question, when non-empty string
 * 3. translated_bot_message, when non-empty string (subsequent chat steps)
 * 4. bot_message, when non-empty string (subsequent chat steps)
 * 5. introductory_message, as fallback when appropriate
 *
 * @param {Object|null|undefined} response - The API response object
 * @returns {string} The question text or empty string
 */
export const extractMCQQuestionText = response => {
  if (!response || typeof response !== "object") return ""

  if (typeof response.translated_bot_question === "string" && response.translated_bot_question.trim()) {
    return response.translated_bot_question.trim()
  }
  if (typeof response.first_bot_question === "string" && response.first_bot_question.trim()) {
    return response.first_bot_question.trim()
  }
  if (typeof response.translated_bot_message === "string" && response.translated_bot_message.trim()) {
    return response.translated_bot_message.trim()
  }
  if (typeof response.bot_message === "string" && response.bot_message.trim()) {
    return response.bot_message.trim()
  }
  if (typeof response.bot_question === "string" && response.bot_question.trim()) {
    return response.bot_question.trim()
  }
  if (typeof response.introductory_message === "string" && response.introductory_message.trim()) {
    return response.introductory_message.trim()
  }

  return ""
}
