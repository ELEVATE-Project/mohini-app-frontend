import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createDynamicStorageAdapter } from './persistence';
import useFlowStore from './flowStore';

/**
 * Language store manages language preferences
 * Keys: route, preferred_route, local_route, hasSelectedLanguage, lang_progress
 */
const useLanguageStore = create(
  persist(
    (set, get) => ({
      // Language state
      route: null,
      preferred_route: null,
      local_route: null,
      hasSelectedLanguage: null,
      lang_progress: null,

      // Actions
      setRoute: (route) => set({ route }),
      setPreferredRoute: (preferred_route) => set({ preferred_route }),
      setLocalRoute: (local_route) => set({ local_route }),
      setHasSelectedLanguage: (hasSelectedLanguage) => set({ hasSelectedLanguage }),
      setLangProgress: (lang_progress) => set({ lang_progress }),

      // Helper to get a value by key (for backward compatibility)
      getValue: (key) => {
        const state = get();
        return state[key] ?? null;
      },

      // Helper to set a value by key (for backward compatibility)
      setValue: (key, value) => set({ [key]: value }),

      // Clear all language data
      clear: () => set({
        route: null,
        preferred_route: null,
        local_route: null,
        hasSelectedLanguage: null,
        lang_progress: null,
      }),
    }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => 
        createDynamicStorageAdapter(
          () => useFlowStore.getState()?.flow || null,
          () => useFlowStore.getState()?.projectId || null
        )
      ),
    }
  )
);

export default useLanguageStore;

