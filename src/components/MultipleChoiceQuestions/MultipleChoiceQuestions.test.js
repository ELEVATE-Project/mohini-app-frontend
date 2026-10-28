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
})
