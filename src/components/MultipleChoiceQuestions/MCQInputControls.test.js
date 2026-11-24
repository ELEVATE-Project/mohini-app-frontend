import React from "react"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultipleChoiceQuestions from "./MultipleChoiceQuestions"
import { isMCQEligible } from "../../utils/mcqUtils"

// Test component simulating the docked container and input row from dynamic-voice-chat.js
const ChatInputDock = ({
  response,
  onSubmitMcq,
  onSendMessage,
  isFetchingData = false,
  hasStartedRecording = false,
  textMessage = "",
  onChangeText = () => {},
}) => {
  const shouldShowMCQ = isMCQEligible(response)

  return (
    <div className="chat-bottom-docked-container">
      {shouldShowMCQ && (
        <MultipleChoiceQuestions
          validations={response.validations}
          question={response.first_bot_question || response.bot_message}
          onSubmit={onSubmitMcq}
          disabled={isFetchingData}
          language="en"
        />
      )}
      <form
        className="chat-input-row"
        onSubmit={e => {
          e.preventDefault()
          if (!isFetchingData && !shouldShowMCQ) {
            onSendMessage(e)
          }
        }}
      >
        <button
          type="button"
          aria-label="recordingButton"
          disabled={isFetchingData || shouldShowMCQ}
          data-testid="mic-button"
        >
          Mic
        </button>

        <textarea
          data-testid="chat-textarea"
          placeholder={
            shouldShowMCQ
              ? "Please choose an option above"
              : "Type a message..."
          }
          value={textMessage}
          onChange={onChangeText}
          disabled={hasStartedRecording || isFetchingData || shouldShowMCQ}
        />

        <button
          type="submit"
          aria-label="sendMessage"
          data-testid="send-button"
          disabled={!textMessage.trim() || hasStartedRecording || isFetchingData || shouldShowMCQ}
        >
          Send
        </button>
      </form>
    </div>
  )
}

describe("MCQ Input Controls Integration (Scenarios 9 & 10)", () => {
  const eligibleMcqResponse = {
    operation_type: "non_llm",
    first_bot_question: "Did you had food ?",
    validations: {
      type: "MULTIPLE_CHOICE",
      config: {
        choices: [
          { key: "yes", text: "Yes" },
          { key: "no", text: "No" },
        ],
        min_choices: 1,
        max_choices: 1,
      },
    },
  }

  const nonMcqResponse = {
    operation_type: "llm",
    bot_message: "Hello! How can I help you today?",
  }

  test("Scenario 9: When MCQ is visible, textarea, mic, and send controls are disabled and placeholder changes", () => {
    const onSubmitMcq = jest.fn()
    const onSendMessage = jest.fn()

    render(
      <ChatInputDock
        response={eligibleMcqResponse}
        onSubmitMcq={onSubmitMcq}
        onSendMessage={onSendMessage}
        textMessage="Draft message"
      />
    )

    // MCQ card should be in the document
    expect(screen.getByText("Did you had food ?")).toBeInTheDocument()
    expect(screen.getByText("Yes")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()

    // Textarea should be disabled with specific placeholder
    const textarea = screen.getByTestId("chat-textarea")
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveAttribute("placeholder", "Please choose an option above")

    // Mic button should be disabled
    const micButton = screen.getByTestId("mic-button")
    expect(micButton).toBeDisabled()

    // Send button should be disabled even if textMessage is present
    const sendButton = screen.getByTestId("send-button")
    expect(sendButton).toBeDisabled()

    // Form submission does not trigger onSendMessage
    fireEvent.submit(sendButton.closest("form"))
    expect(onSendMessage).not.toHaveBeenCalled()
  })

  test("Scenario 10: When MCQ is hidden, input controls return to normal enabled state", () => {
    const onSubmitMcq = jest.fn()
    const onSendMessage = jest.fn()

    render(
      <ChatInputDock
        response={nonMcqResponse}
        onSubmitMcq={onSubmitMcq}
        onSendMessage={onSendMessage}
        textMessage="Hello world"
      />
    )

    // MCQ card should not be in the document
    expect(screen.queryByText("Did you had food ?")).not.toBeInTheDocument()

    // Textarea should be enabled with normal placeholder
    const textarea = screen.getByTestId("chat-textarea")
    expect(textarea).not.toBeDisabled()
    expect(textarea).toHaveAttribute("placeholder", "Type a message...")

    // Mic button should be enabled
    const micButton = screen.getByTestId("mic-button")
    expect(micButton).not.toBeDisabled()

    // Send button should be enabled with text
    const sendButton = screen.getByTestId("send-button")
    expect(sendButton).not.toBeDisabled()

    // Submitting form triggers onSendMessage
    fireEvent.submit(sendButton.closest("form"))
    expect(onSendMessage).toHaveBeenCalledTimes(1)
  })
})
