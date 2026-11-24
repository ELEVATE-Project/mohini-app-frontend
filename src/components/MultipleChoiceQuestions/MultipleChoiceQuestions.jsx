import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { FaCheck, FaVolumeUp } from "react-icons/fa"
import { IoSend } from "react-icons/io5"
import "./MultipleChoiceQuestions.css"

/**
 * MultipleChoiceQuestions component
 * Renders on top of the chat input box when the backend/step requests MCQ response.
 */
const MultipleChoiceQuestions = ({
  validations,
  question = "",
  onSubmit,
  disabled = false,
  language = "en",
  submissionError = "",
}) => {
  const [selectedKeys, setSelectedKeys] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null)
  const audioRef = useRef(null)

  const config = validations?.config || {}
  const choices = config.choices || []
  const minChoices = config.min_choices ?? 1
  const maxChoices = config.max_choices ?? 1
  const isSingleChoice = maxChoices === 1
  const questionText = question || validations?.bot_message || ""

  // Clear selections if validations change
  useEffect(() => {
    setSelectedKeys([])
    setErrorMessage("")
  }, [validations])

  useEffect(() => {
    if (submissionError) {
      setErrorMessage(submissionError)
    }
  }, [submissionError])

  const getErrorMessage = (key, fallback = "") => {
    const raw = validations?.error_message
    if (Array.isArray(raw)) {
      const match = raw.find(item => item && item.key === key)
      if (match?.text) return match.text
    } else if (raw && typeof raw === "object") {
      if (typeof raw[key] === "string" && raw[key]) return raw[key]
      if (raw[key]?.text) return raw[key].text
    }
    return fallback
  }

  const getChoiceLabel = choice => {
    if (!choice) return ""
    if (language && language !== "en") {
      if (choice.translations && choice.translations[language]?.text) {
        return choice.translations[language].text
      }
      if (choice.translations && choice.translations[language]?.label) {
        return choice.translations[language].label
      }
      if (choice.translated_text) {
        return choice.translated_text
      }
      if (choice.translated_label) {
        return choice.translated_label
      }
    }
    return choice.text || choice.label || choice.key || ""
  }

  const getChoiceAudioUrl = choice => {
    return choice?.audio_s3_url || choice?.audio_url || null
  }

  const handleToggleChoice = (choice) => {
    if (disabled) return
    setErrorMessage("")

    const key = choice.key
    const isSelected = selectedKeys.includes(key)

    if (isSingleChoice) {
      // Toggle or select single
      setSelectedKeys([key])
      return
    }

    // Multiple selection
    if (isSelected) {
      setSelectedKeys(prev => prev.filter(k => k !== key))
    } else {
      if (selectedKeys.length >= maxChoices) {
        const msg =
          getErrorMessage("max") ||
          getErrorMessage("default") ||
          `You can select up to ${maxChoices} options.`
        setErrorMessage(msg)
        return
      }
      setSelectedKeys(prev => [...prev, key])
    }
  }

  const handleAudioPlay = (e, audioUrl) => {
    e.stopPropagation()
    if (!audioUrl) return

    if (playingAudioUrl === audioUrl && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setPlayingAudioUrl(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(audioUrl)
    audioRef.current = audio
    setPlayingAudioUrl(audioUrl)
    audio.play().catch(err => {
      console.warn("Could not play audio:", err)
      setPlayingAudioUrl(null)
    })
    audio.onended = () => setPlayingAudioUrl(null)
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (disabled) return

    if (selectedKeys.length < minChoices) {
      const msg =
        getErrorMessage("required") ||
        getErrorMessage("min") ||
        getErrorMessage("default") ||
        `Please select at least ${minChoices} option${minChoices > 1 ? "s" : ""}.`
      setErrorMessage(msg)
      return
    }

    if (selectedKeys.length > maxChoices) {
      const msg =
        getErrorMessage("max") ||
        getErrorMessage("default") ||
        `You can select up to ${maxChoices} options.`
      setErrorMessage(msg)
      return
    }

    const selectedChoices = choices.filter(c => selectedKeys.includes(c.key))
    // Determine the message text to show in the chat and send to the backend
    const messageText = selectedChoices.map(c => getChoiceLabel(c)).join(", ")

    if (onSubmit) {
      onSubmit(selectedChoices, messageText)
    }
  }

  if (!choices || choices.length === 0) return null

  return (
    <div className="mcq-container animate-fade-slide-up" role="region" aria-label="Multiple choice options">
      {/* Bot message / Question prompt */}
      {questionText && (
        <div className="mcq-question-text">
          {questionText}
        </div>
      )}

      {/* Optional helper / rule indicator */}
      <div className="mcq-header">
        <span className="mcq-instruction">
          {isSingleChoice
            ? "Choose 1 option:"
            : `Choose up to ${maxChoices} options:`}
        </span>
        {selectedKeys.length > 0 && (
          <span className="mcq-count-badge">
            {selectedKeys.length} selected
          </span>
        )}
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="mcq-error-banner" role="alert">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Choice buttons grid/flex */}
      <div className="mcq-choices-grid">
        {choices.map(choice => {
          const isSelected = selectedKeys.includes(choice.key)
          const label = getChoiceLabel(choice)
          const audioUrl = getChoiceAudioUrl(choice)

          return (
            <button
              key={choice.key}
              type="button"
              disabled={disabled}
              className={`mcq-choice-btn ${isSelected ? "selected" : ""}`}
              onClick={() => handleToggleChoice(choice)}
              aria-pressed={isSelected}
            >
              <span className="mcq-checkbox-circle">
                {isSelected && <FaCheck className="mcq-check-icon" />}
              </span>

              <span className="mcq-choice-label">{label}</span>

              {audioUrl && (
                <span
                  role="button"
                  tabIndex={0}
                  className={`mcq-audio-btn ${playingAudioUrl === audioUrl ? "playing" : ""}`}
                  onClick={e => handleAudioPlay(e, audioUrl)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleAudioPlay(e, audioUrl)
                    }
                  }}
                  aria-label={`Play pronunciation for ${label}`}
                  title="Listen"
                >
                  <FaVolumeUp />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Submit Button */}
      <div className="mcq-actions-bar">
        <button
          type="button"
          disabled={disabled || selectedKeys.length < minChoices || selectedKeys.length > maxChoices}
          className="mcq-submit-btn"
          onClick={handleSubmit}
        >
          <span>Submit</span>
          <IoSend className="mcq-submit-icon" />
        </button>
      </div>
    </div>
  )
}

MultipleChoiceQuestions.propTypes = {
  validations: PropTypes.shape({
    type: PropTypes.string,
    render_as: PropTypes.string,
    error_message: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    error_audio_url: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    config: PropTypes.shape({
      choices: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          text: PropTypes.string,
          label: PropTypes.string,
          translated_label: PropTypes.string,
          audio_url: PropTypes.string,
          audio_s3_url: PropTypes.string,
          translations: PropTypes.object,
        })
      ),
      min_choices: PropTypes.number,
      max_choices: PropTypes.number,
    }),
  }),
  onSubmit: PropTypes.func.isRequired,
  question: PropTypes.string,
  disabled: PropTypes.bool,
  language: PropTypes.string,
  submissionError: PropTypes.string,
}

export default MultipleChoiceQuestions
