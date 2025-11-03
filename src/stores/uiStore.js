import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createDynamicStorageAdapter } from './persistence';
import useFlowStore from './flowStore';

/**
 * UI store manages UI state and flags
 * Keys: showHomepage, has_accepted_tnc, sessionid, grit
 * Runtime state: isLoading, isIntroLoading, isEndStoryLoading, isFetchingOldIntro, 
 * isPdfDownloading, isImageUploading, isFetchingData, isModalOpen, isOpen, 
 * triggerDownload, noStoryFound, ssoNavigationTriggered, isResetCalled, isChatVisible, showFileInput
 */
const useUiStore = create(
  persist(
    (set, get) => ({
      // Persisted UI state
      showHomepage: null,
      has_accepted_tnc: null,
      sessionid: null,
      grit: null,

      // Runtime UI state (not persisted)
      isLoading: true,
      isIntroLoading: false,
      isEndStoryLoading: false,
      isFetchingOldIntro: false,
      isPdfDownloading: false,
      isImageUploading: false,
      isFetchingData: false,
      isModalOpen: false,
      isOpen: false,
      triggerDownload: false,
      noStoryFound: false,
      ssoNavigationTriggered: false,
      isResetCalled: false,
      isChatVisible: false,
      showFileInput: null,

      // Actions for persisted state
      setShowHomepage: (showHomepage) => set({ showHomepage }),
      setHasAcceptedTnc: (has_accepted_tnc) => set({ has_accepted_tnc }),
      setSessionId: (sessionid) => set({ sessionid }),
      setGrit: (grit) => set({ grit }),

      // Actions for runtime state
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsIntroLoading: (isIntroLoading) => set({ isIntroLoading }),
      setIsEndStoryLoading: (isEndStoryLoading) => set({ isEndStoryLoading }),
      setIsFetchingOldIntro: (isFetchingOldIntro) => set({ isFetchingOldIntro }),
      setIsPdfDownloading: (isPdfDownloading) => set({ isPdfDownloading }),
      setIsImageUploading: (isImageUploading) => set({ isImageUploading }),
      setIsFetchingData: (isFetchingData) => set({ isFetchingData }),
      setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
      setIsOpen: (isOpen) => set({ isOpen }),
      setTriggerDownload: (triggerDownload) => set({ triggerDownload }),
      setNoStoryFound: (noStoryFound) => set({ noStoryFound }),
      setSsoNavigationTriggered: (ssoNavigationTriggered) => set({ ssoNavigationTriggered }),
      setIsResetCalled: (isResetCalled) => set({ isResetCalled }),
      setIsChatVisible: (isChatVisible) => set({ isChatVisible }),
      setShowFileInput: (showFileInput) => set({ showFileInput }),

      // Helper to get a value by key (for backward compatibility)
      getValue: (key) => {
        const state = get();
        return state[key] ?? null;
      },

      // Helper to set a value by key (for backward compatibility)
      setValue: (key, value) => set({ [key]: value }),

      // Clear all UI data (persisted)
      clear: () => set({
        showHomepage: null,
        has_accepted_tnc: null,
        sessionid: null,
        grit: null,
      }),

      // Clear runtime UI state
      clearRuntime: () => set({
        isLoading: false,
        isIntroLoading: false,
        isEndStoryLoading: false,
        isFetchingOldIntro: false,
        isPdfDownloading: false,
        isImageUploading: false,
        isFetchingData: false,
        isModalOpen: false,
        isOpen: false,
        triggerDownload: false,
        noStoryFound: false,
        ssoNavigationTriggered: false,
        isResetCalled: false,
        isChatVisible: false,
        showFileInput: null,
      }),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => 
        createDynamicStorageAdapter(
          () => useFlowStore.getState()?.flow || null,
          () => useFlowStore.getState()?.projectId || null
        )
      ),
    }
  )
);

export default useUiStore;

