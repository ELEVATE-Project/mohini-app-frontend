import { Page, Locator } from "@playwright/test"
import { BasePage } from "./base.page"

/**
 * MIPFlowPage handles interactions with the MIP (Micro Improvement Plan) flow
 * This covers the full journey: InitialSwitch -> DefineChallenge -> SelectObjective
 *   -> ActionItems -> WeeksSelection -> TitleGeneration -> MIP Created
 */
export class MIPFlowPage extends BasePage {
  // Common locators
  private readonly chatBoxTextarea: Locator
  private readonly chatBoxSendButton: Locator
  private readonly termsAndConditionsContainer: Locator
  private readonly termsAndConditionsAcceptButton: Locator
  private readonly welcomeCard: Locator
  private readonly loadingIndicator: Locator

  // InitialSwitch / DefineChallenge chat locators
  private readonly chatMessageContainer: Locator

  // SelectObjective locators
  private readonly objectiveCards: Locator
  private readonly objectiveNextButton: Locator
  private readonly objectiveTitle: Locator

  // ActionItems locators
  private readonly actionItemsContainer: Locator
  private readonly actionItemNextButton: Locator

  // WeeksSelection locators
  private readonly weeksSelectionBotMessage: Locator

  // TitleGeneration locators
  private readonly titleTextarea: Locator
  private readonly createMIPButton: Locator

  /**
   * Constructor for MIPFlowPage
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    super(page)

    // Chat box (shared across InitialSwitch, DefineChallenge, WeeksSelection)
    this.chatBoxTextarea = page.locator("textarea#chat-box-textarea")
    this.chatBoxSendButton = page.locator("form button[type='submit']")

    // Terms and conditions
    this.termsAndConditionsContainer = page.locator("div.tnc-cover")
    this.termsAndConditionsAcceptButton = page.locator("button.tnc-button.accept")

    // Welcome card
    this.welcomeCard = page.locator("div.bg-white.shadow-\\[0px_2px_4px_0px_\\#0000000D\\]")

    // Loading indicator
    this.loadingIndicator = page.locator(".login-load-spinner")

    // Chat messages (both user and bot messages in the chat window)
    this.chatMessageContainer = page.locator("li.div34")

    // SelectObjective
    this.objectiveCards = page.locator("div.secondpage-obj-bttn-div, div.secondpage-obj-selected-button-div")
    this.objectiveNextButton = page.locator("button.thirdpage-select-bttn").first()
    this.objectiveTitle = page.locator("p.secondpage-obj-text").first()

    // ActionItems - the swipeable action item card
    this.actionItemsContainer = page.locator("div.thirdpage-obj-selected-button-div")
    this.actionItemNextButton = page.locator("button.thirdpage-select-bttn").first()

    // WeeksSelection
    this.weeksSelectionBotMessage = page.locator("div.bot-message-container")

    // TitleGeneration
    this.titleTextarea = page.locator("div.secondpage-textbox-container textarea, div.secondpage-textbox-container [contenteditable='true']")
    this.createMIPButton = page.locator("button.fifthpage-select-bttn")
  }

  /**
   * Navigate to the mitra-chat page
   */
  async navigateToMitraChat(): Promise<void> {
    await this.navigate("/mohini/mitra-chat")
  }

  /**
   * Wait for the main page to fully load (loading spinner disappears)
   */
  async waitForMainPageLoad(): Promise<void> {
    await this.waitForElementHidden(this.loadingIndicator, 60000)
  }

  /**
   * Accept terms and conditions popup
   */
  async acceptTermsAndConditions(): Promise<void> {
    await this.waitForElement(this.termsAndConditionsContainer, 15000)
    await this.clickElement(this.termsAndConditionsAcceptButton)
  }

  /**
   * Check if terms and conditions popup is visible
   */
  async isTermsAndConditionsVisible(): Promise<boolean> {
    return await this.isElementVisible(this.termsAndConditionsContainer)
  }

  /**
   * Wait for the welcome card to be visible (InitialSwitch loaded)
   */
  async waitForWelcomeCard(): Promise<void> {
    await this.waitForElement(this.welcomeCard, 30000)
  }

  /**
   * Wait for the chat box textarea to be available and enabled
   */
  async waitForChatBox(): Promise<void> {
    await this.waitForElement(this.chatBoxTextarea, 30000)
  }

  /**
   * Send a chat message via the chat box
   * @param message - Message to send
   */
  async sendChatMessage(message: string): Promise<void> {
    await this.waitForElement(this.chatBoxTextarea, 30000)
    await this.fillInput(this.chatBoxTextarea, message)
    await this.clickElement(this.chatBoxSendButton)
  }

  /**
   * Wait for a bot response to appear in the chat
   * Waits for a new chat message container to be added
   * @param expectedCount - Expected number of chat messages after response
   * @param timeout - Timeout in milliseconds
   */
  async waitForBotResponse(expectedCount: number, timeout: number = 60000): Promise<void> {
    await this.page.waitForFunction(
      ({ selector, count }) => {
        return document.querySelectorAll(selector).length >= count
      },
      { selector: "li.div34", count: expectedCount },
      { timeout }
    )
  }

  /**
   * Get the count of chat message containers
   */
  async getChatMessageCount(): Promise<number> {
    return await this.chatMessageContainer.count()
  }

  // ==================== INITIAL SWITCH STEP ====================

  /**
   * Send the initial MIP message to select the MIP flow
   * @param message - The flow selection message (e.g., "MIP")
   */
  async sendInitialSwitchMessage(message: string): Promise<void> {
    await this.sendChatMessage(message)
  }

  // ==================== DEFINE CHALLENGE STEP ====================

  /**
   * Wait for the DefineChallenge section to load
   * Checks for the chat box in the define challenge section
   */
  async waitForDefineChallengeLoad(): Promise<void> {
    await this.waitForElement(this.chatBoxTextarea, 60000)
  }

  /**
   * Send a define challenge message
   * @param message - The challenge definition message
   */
  async sendDefineChallengeMessage(message: string): Promise<void> {
    await this.sendChatMessage(message)
  }

  // ==================== SELECT OBJECTIVE STEP ====================

  /**
   * Wait for the SelectObjective section to load
   * Objectives should be generated and displayed as cards
   */
  async waitForObjectivesLoad(): Promise<void> {
    await this.waitForElement(this.objectiveTitle, 120000)
    await this.waitForElement(this.objectiveCards.first(), 120000)
  }

  /**
   * Get the number of visible objective cards
   */
  async getObjectiveCount(): Promise<number> {
    return await this.objectiveCards.count()
  }

  /**
   * Select an objective by index
   * @param index - Zero-based index of the objective to select
   */
  async selectObjectiveByIndex(index: number): Promise<void> {
    const card = this.objectiveCards.nth(index)
    await this.scrollIntoView(card)
    await this.clickElement(card)
  }

  /**
   * Click the Next button on the objective selection page
   */
  async clickObjectiveNext(): Promise<void> {
    const nextButton = this.page.locator("button.thirdpage-select-bttn").first()
    await this.scrollIntoView(nextButton)
    await this.clickElement(nextButton)
  }

  /**
   * Check if the Next button on objectives is enabled
   */
  async isObjectiveNextEnabled(): Promise<boolean> {
    const nextButton = this.page.locator("button.thirdpage-select-bttn").first()
    const isDisabled = await nextButton.getAttribute("disabled")
    return isDisabled === null
  }

  // ==================== ACTION ITEMS STEP ====================

  /**
   * Wait for the ActionItems section to load
   * Action items should be generated and displayed
   */
  async waitForActionItemsLoad(): Promise<void> {
    await this.waitForElement(this.actionItemsContainer.first(), 120000)
  }

  /**
   * Click on the action items card to select it
   */
  async selectActionItem(): Promise<void> {
    const actionCard = this.actionItemsContainer.first()
    await this.scrollIntoView(actionCard)
    await this.clickElement(actionCard)
  }

  /**
   * Wait for the final action page (edit/reorder action steps) to appear
   */
  async waitForFinalActionPage(): Promise<void> {
    await this.waitForElement(
      this.page.locator("div.final-action-page"),
      30000
    )
  }

  /**
   * Click the Next/Continue button on the action items page
   */
  async clickActionItemNext(): Promise<void> {
    const nextButton = this.page.locator("div.final-action-page button.thirdpage-select-bttn")
    await this.scrollIntoView(nextButton)
    await this.clickElement(nextButton)
  }

  /**
   * Check if action item next button is enabled
   */
  async isActionItemNextEnabled(): Promise<boolean> {
    const nextButton = this.page.locator("div.final-action-page button.thirdpage-select-bttn")
    const isDisabled = await nextButton.getAttribute("disabled")
    return isDisabled === null
  }

  // ==================== WEEKS SELECTION STEP ====================

  /**
   * Wait for the WeeksSelection section to load
   */
  async waitForWeeksSelectionLoad(): Promise<void> {
    await this.waitForElement(this.chatBoxTextarea, 60000)
  }

  /**
   * Send the weeks selection message
   * @param weeks - Number of weeks (1-6)
   */
  async sendWeeksSelection(weeks: string): Promise<void> {
    await this.sendChatMessage(weeks)
  }

  // ==================== TITLE GENERATION STEP ====================

  /**
   * Wait for the TitleGeneration section to load
   * The title textarea with AI-generated title should be visible
   */
  async waitForTitleGenerationLoad(): Promise<void> {
    await this.waitForElement(this.titleTextarea, 120000)
  }

  /**
   * Get the auto-generated title text
   */
  async getGeneratedTitle(): Promise<string> {
    return await this.titleTextarea.inputValue()
  }

  /**
   * Clear and set a new title
   * @param title - The title to set
   */
  async setTitle(title: string): Promise<void> {
    await this.fillInput(this.titleTextarea, title)
  }

  /**
   * Click the "Create Micro Improvement Plan" button
   */
  async clickCreateMIP(): Promise<void> {
    await this.scrollIntoView(this.createMIPButton)
    await this.clickElement(this.createMIPButton)
  }

  /**
   * Check if the Create MIP button is enabled
   */
  async isCreateMIPButtonEnabled(): Promise<boolean> {
    return await this.createMIPButton.isEnabled()
  }

  // ==================== IMPROVEMENT PLAN PAGE ====================

  /**
   * Wait for navigation to the improvement plan page after MIP creation
   * @param timeout - Timeout in milliseconds
   */
  async waitForImprovementPlanPage(timeout: number = 120000): Promise<void> {
    await this.page.waitForURL("**/improvement-plan**", { timeout })
  }

  /**
   * Check if we are on the improvement plan page
   */
  isOnImprovementPlanPage(): boolean {
    return this.getCurrentUrl().includes("/improvement-plan")
  }
}
