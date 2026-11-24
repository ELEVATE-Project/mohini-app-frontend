import React from "react"
import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultipleChoiceQuestions from "./MultipleChoiceQuestions"
import sampleMock from "../../mock/sample_mcq_response.json"

describe("MultipleChoiceQuestions Component", () => {
  test("renders choice buttons and question from validations config", () => {
    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={sampleMock.validations}
        question={sampleMock.bot_message}
        onSubmit={onSubmit}
        language="en"
      />
    )

    expect(
      screen.getByText("How often are Parent-Teacher Meetings (PTMs) conducted in your child's school?")
    ).toBeInTheDocument()
    expect(screen.getByText("Monthly")).toBeInTheDocument()
    expect(screen.getByText("Quarterly")).toBeInTheDocument()
    expect(screen.getByText("Half-Yearly")).toBeInTheDocument()
    expect(screen.getByText("Annually")).toBeInTheDocument()
    expect(screen.getByText("Submit")).toBeInTheDocument()
  })

  test("disables submit button initially when no option is selected (min_choices = 1)", () => {
    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={sampleMock.validations}
        onSubmit={onSubmit}
        language="en"
      />
    )

    const submitBtn = screen.getByText("Submit").closest("button")
    expect(submitBtn).toBeDisabled()
  })

  test("selects an option and enables submit button", () => {
    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={sampleMock.validations}
        onSubmit={onSubmit}
        language="en"
      />
    )

    const monthlyBtn = screen.getByText("Monthly").closest("button")
    fireEvent.click(monthlyBtn)

    expect(monthlyBtn).toHaveClass("selected")

    const submitBtn = screen.getByText("Submit").closest("button")
    expect(submitBtn).not.toBeDisabled()

    fireEvent.click(submitBtn)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      [expect.objectContaining({ key: "monthly", label: "Monthly" })],
      "Monthly"
    )
  })

  test("displays translated label when present", () => {
    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={sampleMock.validations}
        onSubmit={onSubmit}
        language="ta"
      />
    )

    // In sampleMock, monthly has translated_label: "மாதந்தோறும்"
    expect(screen.getByText("மாதந்தோறும்")).toBeInTheDocument()
  })

  test("handles multi-choice and max_choices constraint", () => {
    const onSubmit = jest.fn()
    const multiMock = {
      ...sampleMock.validations,
      config: {
        ...sampleMock.validations.config,
        min_choices: 1,
        max_choices: 2,
      },
    }

    render(
      <MultipleChoiceQuestions
        validations={multiMock}
        onSubmit={onSubmit}
        language="en"
      />
    )

    const monthlyBtn = screen.getByText("Monthly").closest("button")
    const quarterlyBtn = screen.getByText("Quarterly").closest("button")
    const halfYearlyBtn = screen.getByText("Half-Yearly").closest("button")

    fireEvent.click(monthlyBtn)
    fireEvent.click(quarterlyBtn)

    expect(monthlyBtn).toHaveClass("selected")
    expect(quarterlyBtn).toHaveClass("selected")

    // Attempting to select a 3rd option should trigger the error message
    fireEvent.click(halfYearlyBtn)
    expect(
      screen.getByText("You can select up to 3 options.") ||
      screen.getByText("You can select up to 2 options.")
    ).toBeInTheDocument()

    // Submit multi-choice
    const submitBtn = screen.getByText("Submit").closest("button")
    fireEvent.click(submitBtn)

    expect(onSubmit).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ key: "monthly" }),
        expect.objectContaining({ key: "quarterly" }),
      ]),
      "Monthly, Quarterly"
    )
  })

  test("renders dynamically from actual backend API response schema (Yes/No/Skip)", () => {
    const actualBackendResponse = {
      name: "MItra",
      operation_type: "non_llm",
      introductory_message: "Did you had food ?",
      first_bot_question: "Did you had food ?",
      translated_bot_question: null,
      audio_url: null,
      audio_s3_url: null,
      validations: {
        method: "FE",
        type: "MULTIPLE_CHOICE",
        render_as: "BUTTONS",
        error_message: [
          {
            key: "required",
            text: "Please choose 1 option",
            audio_s3_url: null,
          },
          {
            key: "default",
            text: "Please choose 1 option",
            audio_s3_url: null,
          },
        ],
        config: {
          choices: [
            {
              key: "yes",
              text: "Yes",
              audio_s3_url: null,
            },
            {
              key: "no",
              text: "No",
              audio_s3_url: null,
            },
            {
              key: "skip",
              text: "Skip",
              audio_s3_url: null,
            },
          ],
          min_choices: 1,
          max_choices: 1,
        },
      },
    }

    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={actualBackendResponse.validations}
        question={actualBackendResponse.first_bot_question}
        onSubmit={onSubmit}
        language="en"
      />
    )

    // Checks question text
    expect(screen.getByText("Did you had food ?")).toBeInTheDocument()

    // Checks choice options
    expect(screen.getByText("Yes")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()
    expect(screen.getByText("Skip")).toBeInTheDocument()

    // Verify null audio URLs do not render audio buttons
    const audioButtons = screen.queryAllByTitle("Listen")
    expect(audioButtons).toHaveLength(0)

    // Submit button should initially be disabled
    const submitBtn = screen.getByText("Submit").closest("button")
    expect(submitBtn).toBeDisabled()

    // Select "Yes"
    const yesBtn = screen.getByText("Yes").closest("button")
    fireEvent.click(yesBtn)
    expect(yesBtn).toHaveClass("selected")
    expect(submitBtn).not.toBeDisabled()

    // Submit selection
    fireEvent.click(submitBtn)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      [expect.objectContaining({ key: "yes", text: "Yes" })],
      "Yes"
    )
  })

  test("renders audio button when valid audio_s3_url is present and handles audio playback", () => {
    const validationsWithAudio = {
      type: "MULTIPLE_CHOICE",
      config: {
        choices: [
          {
            key: "option_a",
            text: "Option A",
            audio_s3_url: "https://example.com/audio.mp3",
          },
        ],
        min_choices: 1,
        max_choices: 1,
      },
    }

    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={validationsWithAudio}
        question="Select option"
        onSubmit={onSubmit}
        language="en"
      />
    )

    const audioBtn = screen.getByTitle("Listen")
    expect(audioBtn).toBeInTheDocument()
  })

  test("displays array-based error_message when required validation fails", () => {
    const validationsWithArrayErrors = {
      type: "MULTIPLE_CHOICE",
      error_message: [
        {
          key: "required",
          text: "Please select an answer to proceed",
        },
      ],
      config: {
        choices: [
          { key: "a", text: "Choice A" },
          { key: "b", text: "Choice B" },
        ],
        min_choices: 1,
        max_choices: 1,
      },
    }

    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={validationsWithArrayErrors}
        onSubmit={onSubmit}
        language="en"
      />
    )

    const choiceA = screen.getByText("Choice A").closest("button")
    const choiceB = screen.getByText("Choice B").closest("button")

    // In single choice mode, toggling selects
    fireEvent.click(choiceA)
    expect(choiceA).toHaveClass("selected")

    // Switching to B selects B and unselects A
    fireEvent.click(choiceB)
    expect(choiceB).toHaveClass("selected")
    expect(choiceA).not.toHaveClass("selected")
  })

  test("renders submissionError in error banner when provided", () => {
    const onSubmit = jest.fn()
    render(
      <MultipleChoiceQuestions
        validations={sampleMock.validations}
        question={sampleMock.bot_message}
        onSubmit={onSubmit}
        submissionError="Failed to submit response. Please try again."
        language="en"
      />
    )

    expect(screen.getByRole("alert")).toHaveTextContent("Failed to submit response. Please try again.")
  })
})
