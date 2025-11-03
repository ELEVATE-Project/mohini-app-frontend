import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createDynamicStorageAdapter } from './persistence';
import useFlowStore from './flowStore';

/**
 * User store manages user profile and authentication data
 * Keys: profileid, first_name, company, state, accessToken, phoneNumber, 
 * english_first_name, country, city, ip_city, ip_state, ip_country, device_id
 */
const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      profileid: null,
      first_name: null,
      company: null,
      state: null,
      accessToken: null,
      phoneNumber: null,
      english_first_name: null,
      country: null,
      city: null,
      ip_city: null,
      ip_state: null,
      ip_country: null,
      device_id: null,

      // Actions
      setProfileId: (profileid) => set({ profileid }),
      setFirstName: (first_name) => set({ first_name }),
      setCompany: (company) => set({ company }),
      setState: (state) => set({ state }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      setEnglishFirstName: (english_first_name) => set({ english_first_name }),
      setCountry: (country) => set({ country }),
      setCity: (city) => set({ city }),
      setIpCity: (ip_city) => set({ ip_city }),
      setIpState: (ip_state) => set({ ip_state }),
      setIpCountry: (ip_country) => set({ ip_country }),
      setDeviceId: (device_id) => set({ device_id }),

      // Helper to get a value by key (for backward compatibility)
      getValue: (key) => {
        const state = get();
        return state[key] ?? null;
      },

      // Helper to set a value by key (for backward compatibility)
      setValue: (key, value) => set({ [key]: value }),

      // Clear all user data
      clear: () => set({
        profileid: null,
        first_name: null,
        company: null,
        state: null,
        accessToken: null,
        phoneNumber: null,
        english_first_name: null,
        country: null,
        city: null,
        ip_city: null,
        ip_state: null,
        ip_country: null,
        device_id: null,
      }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => 
        createDynamicStorageAdapter(
          () => useFlowStore.getState()?.flow || null,
          () => useFlowStore.getState()?.projectId || null
        )
      ),
    }
  )
);

export default useUserStore;

