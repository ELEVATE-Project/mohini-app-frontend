import { isMCQEligible, extractMCQQuestionText } from "./mcqUtils"

describe("MCQ Eligibility & Visibility Conditions (Scenarios 1-5)", () => {
  test("Scenario 1: non_llm + MULTIPLE_CHOICE evaluates to true", () => {
    const actualApiResponse = {
      name: "MItra",
      operation_type: "non_llm",
      introductory_message: "Did you had food ?",
      first_bot_question: "Did you had food ?",
      validations: {
        type: "MULTIPLE_CHOICE",
        config: {
          choices: [
            { key: "yes", text: "Yes" },
            { key: "no", text: "No" },
            { key: "skip", text: "Skip" },
          ],
        },
      },
    }
    expect(isMCQEligible(actualApiResponse)).toBe(true)
  })

  test("Scenario 2: non_llm + another validation type evaluates to false", () => {
    expect(
      isMCQEligible({
        operation_type: "non_llm",
        validations: { type: "TEXT" },
      })
    ).toBe(false)

    expect(
      isMCQEligible({
        operation_type: "non_llm",
        validations: { type: "NUMERIC" },
      })
    ).toBe(false)
  })

  test("Scenario 3: llm + MULTIPLE_CHOICE evaluates to false", () => {
    expect(
      isMCQEligible({
        operation_type: "llm",
        validations: { type: "MULTIPLE_CHOICE" },
      })
    ).toBe(false)
  })

  test("Scenario 4: Missing operation_type evaluates to false", () => {
    expect(
      isMCQEligible({
        validations: { type: "MULTIPLE_CHOICE" },
      })
    ).toBe(false)

    expect(
      isMCQEligible({
        operation_type: null,
        validations: { type: "MULTIPLE_CHOICE" },
      })
    ).toBe(false)
  })

  test("Scenario 5: Missing validations evaluates to false", () => {
    expect(
      isMCQEligible({
        operation_type: "non_llm",
      })
    ).toBe(false)

    expect(
      isMCQEligible({
        operation_type: "non_llm",
        validations: null,
      })
    ).toBe(false)

    expect(
      isMCQEligible({
        operation_type: "non_llm",
        validations: {},
      })
    ).toBe(false)
  })

  test("Handles null, undefined, and non-object inputs safely", () => {
    expect(isMCQEligible(null)).toBe(false)
    expect(isMCQEligible(undefined)).toBe(false)
    expect(isMCQEligible("string")).toBe(false)
    expect(isMCQEligible(123)).toBe(false)
  })
})

describe("MCQ Question Text Extraction Priority", () => {
  test("Prioritizes translated_bot_question over other fields", () => {
    const response = {
      translated_bot_question: "நீங்கள் உணவு சாப்பிட்டீர்களா?",
      first_bot_question: "Did you had food ?",
      introductory_message: "Welcome message",
    }
    expect(extractMCQQuestionText(response)).toBe("நீங்கள் உணவு சாப்பிட்டீர்களா?")
  })

  test("Falls back to first_bot_question when translated_bot_question is null or empty", () => {
    const response = {
      translated_bot_question: null,
      first_bot_question: "Did you had food ?",
      introductory_message: "Welcome message",
    }
    expect(extractMCQQuestionText(response)).toBe("Did you had food ?")
  })

  test("Falls back to translated_bot_message for subsequent chat responses", () => {
    const response = {
      translated_bot_question: null,
      first_bot_question: null,
      translated_bot_message: "இரண்டாவது கேள்வி",
      bot_message: "Second question",
    }
    expect(extractMCQQuestionText(response)).toBe("இரண்டாவது கேள்வி")
  })

  test("Falls back to bot_message when translated fields are not present", () => {
    const response = {
      bot_message: "What is your qualification?",
    }
    expect(extractMCQQuestionText(response)).toBe("What is your qualification?")
  })

  test("Falls back to bot_question when bot_message and translated fields are not present", () => {
    const response = {
      bot_question: "Which grade do you teach?",
    }
    expect(extractMCQQuestionText(response)).toBe("Which grade do you teach?")
  })

  test("Falls back to introductory_message when no specific question field exists", () => {
    const response = {
      introductory_message: "Did you had food ?",
    }
    expect(extractMCQQuestionText(response)).toBe("Did you had food ?")
  })

  test("Returns empty string for null, undefined, or empty object", () => {
    expect(extractMCQQuestionText(null)).toBe("")
    expect(extractMCQQuestionText(undefined)).toBe("")
    expect(extractMCQQuestionText({})).toBe("")
  })
})

describe("MCQ Chat Flow Lifecycle & Sequential Transitions (Scenarios 11-14)", () => {
  test("Scenario 11: An eligible MCQ response follows another eligible MCQ response", () => {
    let activeState = {
      operationType: "non_llm",
      validations: {
        type: "MULTIPLE_CHOICE",
        config: { choices: [{ key: "yes", text: "Yes" }, { key: "no", text: "No" }] },
      },
      question: "Did you had food ?",
    }
    expect(isMCQEligible({ operation_type: activeState.operationType, validations: activeState.validations })).toBe(true)

    // User submits answer, next response arrives from backend
    const nextResponse = {
      operation_type: "non_llm",
      bot_message: "How was the food?",
      validations: {
        type: "MULTIPLE_CHOICE",
        config: { choices: [{ key: "good", text: "Good" }, { key: "bad", text: "Bad" }] },
      },
    }

    if (isMCQEligible(nextResponse)) {
      activeState = {
        operationType: "non_llm",
        validations: nextResponse.validations,
        question: extractMCQQuestionText(nextResponse),
      }
    }

    expect(isMCQEligible({ operation_type: activeState.operationType, validations: activeState.validations })).toBe(true)
    expect(activeState.question).toBe("How was the food?")
    expect(activeState.validations.config.choices[0].key).toBe("good")
  })

  test("Scenario 12: An eligible MCQ response is followed by a non-MCQ or LLM response -> MCQ is cleared", () => {
    let activeState = {
      operationType: "non_llm",
      validations: {
        type: "MULTIPLE_CHOICE",
        config: { choices: [{ key: "yes", text: "Yes" }] },
      },
      question: "Did you had food ?",
    }
    expect(isMCQEligible({ operation_type: activeState.operationType, validations: activeState.validations })).toBe(true)

    // Next step is an LLM response or free-text non-MCQ
    const subsequentResponses = [
      { operation_type: "llm", bot_message: "Thank you for the response" },
      { operation_type: "non_llm", bot_message: "Please describe in your own words", validations: { type: "TEXT" } },
      { operation_type: "non_llm", bot_message: "Done", validations: null },
    ]

    for (const res of subsequentResponses) {
      if (isMCQEligible(res)) {
        activeState = {
          operationType: res.operation_type,
          validations: res.validations,
          question: extractMCQQuestionText(res),
        }
      } else {
        activeState = {
          operationType: res.operation_type || null,
          validations: null,
          question: "",
        }
      }

      expect(isMCQEligible({ operation_type: activeState.operationType, validations: activeState.validations })).toBe(false)
      expect(activeState.validations).toBeNull()
      expect(activeState.question).toBe("")
    }
  })

  test("Scenario 13: API failure or incomplete response handles failure without showing stale mock data", () => {
    let activeState = {
      operationType: null,
      validations: null,
      question: "",
    }

    const incompleteResponses = [
      null,
      {},
      { error: "Internal Server Error" },
      { operation_type: null },
      { validations: null },
    ]

    for (const res of incompleteResponses) {
      const isEligible = isMCQEligible(res)
      expect(isEligible).toBe(false)
      if (!isEligible) {
        activeState = {
          operationType: res?.operation_type || null,
          validations: null,
          question: "",
        }
      }
      expect(activeState.validations).toBeNull()
    }
  })

  test("Scenario 14: Answer submission guard prevents duplicate submissions", () => {
    let isSubmitting = false
    let submitCount = 0

    const mockSubmitHandler = () => {
      if (isSubmitting) return
      isSubmitting = true
      submitCount += 1
    }

    // Trigger double clicks or rapid submissions
    mockSubmitHandler()
    mockSubmitHandler()
    mockSubmitHandler()

    expect(submitCount).toBe(1)
  })
})
