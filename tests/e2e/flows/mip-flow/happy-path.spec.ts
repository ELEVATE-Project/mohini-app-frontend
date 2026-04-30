import { test, expect } from "@playwright/test"
import { MIPFlowPage } from "../../../pages/mip-flow.page"
import {
  MIP_INITIAL_SWITCH_MESSAGE,
  MIP_DEFINE_CHALLENGE_MESSAGES,
  MIP_WEEKS_SELECTION_MESSAGE,
  MIP_TITLE,
} from "../../../constant/sg-commons-chat"
/**
 * Happy Path Test Suite for MIP (Micro Improvement Plan) Flow
 * Tests the complete user journey:
 *   1. InitialSwitch - Send "MIP" to select MIP flow
 *   2. DefineChallenge - Describe the challenge via chat
 *   3. SelectObjective - Choose from AI-generated objectives
 *   4. ActionItems - Select and confirm action items
 *   5. WeeksSelection - Choose duration (1-6 weeks)
 *   6. TitleGeneration - Set title and create MIP
 *   7. Verify redirect to improvement plan page
 */
test.describe("MIP Flow - Happy Path", () => {
  let mipFlowPage: MIPFlowPage

  /**
   * Setup before each test
   * Initialize page object and navigate to the application
   */
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()

    mipFlowPage = new MIPFlowPage(page)

    await mipFlowPage.navigateToMitraChat()
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  /**
   * Test: Complete MIP happy path flow
   * Verifies user can go through the entire MIP creation from start to finish
   */
  test("should complete full MIP flow from initial switch to MIP creation", async ({ page }) => {
    // Step 1: Navigate and wait for main page load
    await test.step("Navigate to Mitra Chat and wait for load", async () => {
      await mipFlowPage.navigateToMitraChat()
      await mipFlowPage.waitForMainPageLoad()
    })

    // Step 2: Accept Terms and Conditions
    await test.step("Accept terms and conditions", async () => {
      const isTncVisible = await mipFlowPage.isTermsAndConditionsVisible()
      if (isTncVisible) {
        await mipFlowPage.acceptTermsAndConditions()
      }
    })

    // Step 3: Wait for welcome card and chat box
    await test.step("Wait for InitialSwitch to load", async () => {
      await mipFlowPage.waitForWelcomeCard()
      await mipFlowPage.waitForChatBox()
    })

    // Step 4: Send "MIP" in InitialSwitch to select MIP flow
    await test.step("Send MIP message in InitialSwitch", async () => {
      await mipFlowPage.sendInitialSwitchMessage(MIP_INITIAL_SWITCH_MESSAGE)
      await mipFlowPage.wait(3000)
    })

    // Step 5: State Define Challenge - send challenge messages
    await test.step("Define Challenge - describe the problem", async () => {
      await mipFlowPage.waitForDefineChallengeLoad()

      for (let i = 0; i < MIP_DEFINE_CHALLENGE_MESSAGES.length; i++) {
        await mipFlowPage.sendDefineChallengeMessage(MIP_DEFINE_CHALLENGE_MESSAGES[i])
        await mipFlowPage.wait(3000)
      }
    })

    // Step 6: Select Objective - wait for objectives and select one
    await test.step("Select Objective from AI-generated list", async () => {
      await mipFlowPage.waitForObjectivesLoad()

      const objectiveCount = await mipFlowPage.getObjectiveCount()
      expect(objectiveCount).toBeGreaterThan(0)

      await mipFlowPage.selectObjectiveByIndex(0)
      await mipFlowPage.wait(1000)

      await mipFlowPage.clickObjectiveNext()
      await mipFlowPage.wait(5000)
    })

    // Step 7: Action Items - select an action plan and confirm
    await test.step("Select and confirm Action Items", async () => {
      await mipFlowPage.waitForFinalActionPage()
      await mipFlowPage.clickActionItemNext()
      await mipFlowPage.wait(5000)
    })

    // Step 8: Weeks Selection - choose number of weeks
    await test.step("Select number of weeks", async () => {
      await mipFlowPage.waitForWeeksSelectionLoad()

      await mipFlowPage.sendWeeksSelection(MIP_WEEKS_SELECTION_MESSAGE)
      await mipFlowPage.wait(15000)
    })

    // Step 9: Title Generation - set title and create MIP
    await test.step("Set title and create MIP", async () => {
      await mipFlowPage.waitForTitleGenerationLoad()

      await mipFlowPage.setTitle(MIP_TITLE)
      await mipFlowPage.wait(1000)

      await mipFlowPage.clickCreateMIP()
    })

    // Step 10: Verify redirect to Improvement Plan page
    await test.step("Verify MIP created and redirected to improvement plan", async () => {
      await mipFlowPage.waitForImprovementPlanPage()
      expect(mipFlowPage.isOnImprovementPlanPage()).toBeTruthy()
    })
  })
})
