import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createDynamicStorageAdapter } from './persistence';

/**
 * Flow store manages flow configuration, routing, and project data
 * Keys: flow, projectId, taskId, ssoRerouteURL, previousUrl, tempCode, statemachine_length, selected_type
 * Runtime state: strandStep, shouldFetchIntro, hasFetchIntro
 */
const useFlowStore = create(
  persist(
    (set, get) => ({
      // Persisted flow state
      flow: null,
      projectId: null,
      taskId: null,
      ssoRerouteURL: null,
      previousUrl: null,
      tempCode: null,
      statemachine_length: null,
      selected_type: null,

      // Runtime flow state (not persisted)
      strandStep: null,
      shouldFetchIntro: false,
      hasFetchIntro: false,

      // Actions for persisted state
      setFlow: (flow) => set({ flow }),
      setProjectId: (projectId) => set({ projectId }),
      setTaskId: (taskId) => set({ taskId }),
      setSsoRerouteURL: (ssoRerouteURL) => set({ ssoRerouteURL }),
      setPreviousUrl: (previousUrl) => set({ previousUrl }),
      setTempCode: (tempCode) => set({ tempCode }),
      setStatemachineLength: (statemachine_length) => set({ statemachine_length }),
      setSelectedType: (selected_type) => set({ selected_type }),

      // Actions for runtime state
      setStrandStep: (strandStep) => set({ strandStep }),
      setShouldFetchIntro: (shouldFetchIntro) => set({ shouldFetchIntro }),
      setHasFetchIntro: (hasFetchIntro) => set({ hasFetchIntro }),

      // Helper to get a value by key (for backward compatibility)
      getValue: (key) => {
        const state = get();
        return state[key] ?? null;
      },

      // Helper to set a value by key (for backward compatibility)
      setValue: (key, value) => set({ [key]: value }),

      // Clear all flow data (persisted)
      clear: () => set({
        flow: null,
        projectId: null,
        taskId: null,
        ssoRerouteURL: null,
        previousUrl: null,
        tempCode: null,
        statemachine_length: null,
        selected_type: null,
      }),

      // Clear runtime flow state
      clearRuntime: () => set({
        strandStep: null,
        shouldFetchIntro: false,
        hasFetchIntro: false,
      }),
    }),
    {
      name: 'flow-store',
      storage: createJSONStorage(() => 
        createDynamicStorageAdapter(
          () => {
            // Get flow from store state or fallback to checking storage directly
            const state = useFlowStore.getState();
            return state?.flow || 
              (typeof window !== 'undefined' && (sessionStorage.getItem('flow') || localStorage.getItem('flow'))) ||
              null;
          },
          () => {
            // Get projectId from store state or fallback to checking storage directly
            const state = useFlowStore.getState();
            return state?.projectId ||
              (typeof window !== 'undefined' && (localStorage.getItem('projectId') || sessionStorage.getItem('projectId'))) ||
              null;
          }
        )
      ),
    }
  )
);

export default useFlowStore;

