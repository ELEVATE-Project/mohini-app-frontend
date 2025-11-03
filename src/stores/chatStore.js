import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createDynamicStorageAdapter } from './persistence';
import useFlowStore from './flowStore';

/**
 * Chat store manages chat history and UI state
 * Keys: botName, chat-history, intro_message, isChatVisible, isNewChatOpen, 
 * isOldChatOpen, showFileInput, llmError, chatLanguage, defaultBotName
 * Runtime state: sentences, textMessage, isStreamingComplete, isNextAllowed, 
 * appendix, hasOverRideId, botNameToDisplay, chatTitle, sessionTitleDetail, visibleItemCount
 */
const useChatStore = create(
  persist(
    (set, get) => ({
      // Persisted chat state
      botName: null,
      'chat-history': null,
      intro_message: null,
      isChatVisible: null,
      isNewChatOpen: null,
      isOldChatOpen: null,
      showFileInput: null,
      llmError: null,
      chatLanguage: null,
      defaultBotName: null,

      // Runtime chat state (not persisted)
      chatHistory: [],
      sentences: [],
      textMessage: '',
      isStreamingComplete: true,
      isNextAllowed: true,
      appendix: [],
      hasOverRideId: null,
      botNameToDisplay: 'Bot',
      chatTitle: [],
      sessionTitleDetail: null,
      visibleItemCount: 10,

      // Actions for persisted state
      setBotName: (botName) => set({ botName }),
      setChatHistory: (history) => set({ 'chat-history': history }),
      setIntroMessage: (intro_message) => set({ intro_message }),
      setIsChatVisible: (isChatVisible) => set({ isChatVisible }),
      setIsNewChatOpen: (isNewChatOpen) => set({ isNewChatOpen }),
      setIsOldChatOpen: (isOldChatOpen) => set({ isOldChatOpen }),
      setShowFileInput: (showFileInput) => set({ showFileInput }),
      setLlmError: (llmError) => set({ llmError }),
      setChatLanguage: (chatLanguage) => set({ chatLanguage }),
      setDefaultBotName: (defaultBotName) => set({ defaultBotName }),

      // Actions for runtime state
      setRuntimeChatHistory: (chatHistory) => set({ chatHistory }),
      setSentences: (sentences) => set({ sentences }),
      addSentence: (sentence) => set((state) => ({ sentences: [...state.sentences, sentence] })),
      updateLastBotMessage: (message) =>
        set((state) => {
          const updatedSentences = [...state.sentences];
          if (updatedSentences.length > 0 && updatedSentences[updatedSentences.length - 1]?.source === 'bot') {
            updatedSentences[updatedSentences.length - 1].message += message;
          }
          return { sentences: updatedSentences };
        }),
      setTextMessage: (textMessage) => set({ textMessage }),
      setIsStreamingComplete: (isStreamingComplete) => set({ isStreamingComplete }),
      setIsNextAllowed: (isNextAllowed) => set({ isNextAllowed }),
      setAppendix: (appendix) => set({ appendix }),
      setHasOverRideId: (hasOverRideId) => set({ hasOverRideId }),
      setBotNameToDisplay: (botNameToDisplay) => set({ botNameToDisplay }),
      setChatTitle: (chatTitle) => set({ chatTitle }),
      setSessionTitleDetail: (sessionTitleDetail) => set({ sessionTitleDetail }),
      setVisibleItemCount: (visibleItemCount) => set({ visibleItemCount }),

      // Helper to get a value by key (for backward compatibility)
      getValue: (key) => {
        const state = get();
        // Handle 'chat-history' key with hyphen
        return state[key] ?? null;
      },

      // Helper to set a value by key (for backward compatibility)
      setValue: (key, value) => set({ [key]: value }),

      // Clear all chat data (persisted)
      clear: () => set({
        botName: null,
        'chat-history': null,
        intro_message: null,
        isChatVisible: null,
        isNewChatOpen: null,
        isOldChatOpen: null,
        showFileInput: null,
        llmError: null,
        chatLanguage: null,
        defaultBotName: null,
      }),

      // Clear runtime state
      clearRuntime: () => set({
        chatHistory: [],
        sentences: [],
        textMessage: '',
        isStreamingComplete: true,
        isNextAllowed: true,
        appendix: [],
        hasOverRideId: null,
        botNameToDisplay: 'Bot',
        chatTitle: [],
        sessionTitleDetail: null,
        visibleItemCount: 10,
      }),
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => 
        createDynamicStorageAdapter(
          () => useFlowStore.getState()?.flow || null,
          () => useFlowStore.getState()?.projectId || null
        )
      ),
    }
  )
);

export default useChatStore;

