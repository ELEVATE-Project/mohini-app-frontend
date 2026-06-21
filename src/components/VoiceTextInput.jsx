import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaCircle, FaMicrophone, FaRegStopCircle } from "react-icons/fa";
import { MdSend } from "react-icons/md";

/**
 * VoiceTextInput Component
 *
 * A combined text and voice input component for chat interfaces.
 * Provides a textarea for text input with dynamic height adjustment,
 * voice recording capabilities with visual feedback, and smart button switching
 * between send (when typing) and microphone (when not typing).
 *
 * @param {Object} props - Component props
 * @param {string} props.textMessage - Current text value in the textarea
 * @param {Function} props.onTextChange - Handler called when text changes
 * @param {Function} props.onSubmit - Handler called when form is submitted
 * @param {boolean} props.hasStartedRecording - Flag indicating if recording is active
 * @param {boolean} props.isFetchingData - Flag indicating if ASR processing is in progress
 * @param {boolean} props.hasStartedListening - Flag indicating if listening is active
 * @param {number} props.seconds - Recording timer seconds
 * @param {Function} props.onStartRecording - Handler to start voice recording
 * @param {Function} props.onStopRecording - Handler to stop voice recording
 * @param {boolean} props.showFileInput - Condition to hide/show input
 * @param {boolean} props.isLoading - General loading state
 * @param {boolean} props.isEndStoryLoading - Story completion loading state
 * @param {string} props.llmError - Error message from LLM
 * @param {Array} props.chatHistory - Array of chat messages
 * @param {Function} props.onScrollToView - Handler to scroll chat into view
 */
const VoiceTextInput = ({ textMessage, onTextChange, onSubmit, hasStartedRecording, isFetchingData, hasStartedListening, seconds, onStartRecording, onStopRecording, showFileInput, isLoading, isEndStoryLoading, llmError, chatHistory, onScrollToView }) => {
  const { t } = useTranslation();
  const textAreaRef = useRef(null);

  /**
   * Formats seconds into MM:SS format for recording timer display
   * @param {number} secs - Seconds to format
   * @returns {string} Formatted time string
   */
  const formatTime = secs => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const isTyping = !!textMessage.trim();

  /**
   * Dynamically adjust textarea height when textMessage changes programmatically
   * This handles cases like voice-to-text where text is set without user typing
   */
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [textMessage]);

  return (
    <>
      {(!showFileInput || showFileInput === null) && !isLoading && !isEndStoryLoading && (llmError === "" || !llmError) && Array.isArray(chatHistory) && chatHistory.some(item => item && Object.keys(item).length > 0) && (
        <form
          className="div39 form-1 sm:p-[10px_35px] p-[10px_25px]"
          onSubmit={event => {
            if (!hasStartedListening && !isFetchingData) {
              onSubmit(event);
            }
          }}
          autoComplete="off"
        >
          <div className="textarea-wrapper relative">
            <textarea
              id="textBoxID"
              className={`input-2 input-1 ${isFetchingData ? "min-h-[68px] sm:min-h-0 py-0" : ""}`}
              style={{ alignContent: isFetchingData ? "normal" : "center" }}
              onChange={onTextChange}
              placeholder={hasStartedRecording ? t("placeholder1") : isFetchingData ? t("placeholder2") : t("placeholder3")}
              name="message-box"
              value={textMessage}
              autoFocus={false}
              disabled={hasStartedRecording || isFetchingData}
              ref={textAreaRef}
              onInput={e => {
                e.target.style.height = "auto";
                const maxHeight = 150;
                if (e.target.scrollHeight > maxHeight) {
                  e.target.style.height = `${maxHeight}px`;
                  e.target.style.overflowY = "scroll";
                } else {
                  e.target.style.height = `${e.target.scrollHeight}px`;
                  e.target.style.overflowY = "hidden";
                }
              }}
              onFocus={() => {
                setTimeout(() => {
                  onScrollToView();
                  if (textAreaRef.current) {
                    textAreaRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }, 300);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  if (e.shiftKey) {
                    e.preventDefault();
                    e.target.form.requestSubmit();
                    setTimeout(() => {
                      e.target.value = "";
                    }, 0);
                  } else {
                    // Allow normal enter behavior
                  }
                }
              }}
            />
            {hasStartedRecording && (
              <div className="absolute bottom-3 right-3 flex items-center space-x-1 text-red-600 text-sm font-medium pointer-events-none">
                <FaCircle className="text-red-500 animate-pulse text-xs" />
                <span>{formatTime(seconds)}</span>
              </div>
            )}
          </div>
          {isTyping && !hasStartedListening && !isFetchingData ? (
            <div className="button-container">
              <button type="submit" disabled={hasStartedRecording || isFetchingData} className="button-6 sm:ml-[1.3rem] ml-[0.8rem]">
                <MdSend />
              </button>
            </div>
          ) : (
            <div className={`audio-recorder ${isFetchingData ? "button-container" : ""}`}>
              <button type="button" onClick={hasStartedRecording ? onStopRecording : onStartRecording} disabled={isFetchingData} className={`button-7 sm:ml-[1.3rem] ml-[0.8rem] ${hasStartedRecording ? "button-8" : "button-9"}`}>
                {hasStartedRecording ? <FaRegStopCircle /> : <FaMicrophone />}
              </button>
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default VoiceTextInput;
