import useFlowStore from './flowStore';
import useUserStore from './userStore';
import useChatStore from './chatStore';
import useLanguageStore from './languageStore';
import useUiStore from './uiStore';
import useAudioStore from './audioStore';
import useRecordingStore from './recordingStore';
import useStoryStore from './storyStore';
import { determineStorageType, getStorage } from '../utils/storageUtils';
import { getBothStorages } from './persistence';

// Re-export all stores
export { 
  useFlowStore, 
  useUserStore, 
  useChatStore, 
  useLanguageStore, 
  useUiStore,
  useAudioStore,
  useRecordingStore,
  useStoryStore
};

/**
 * Maps storage keys to their respective stores
 */
const KEY_STORE_MAP = {
  // Flow store keys
  flow: useFlowStore,
  projectId: useFlowStore,
  taskId: useFlowStore,
  ssoRerouteURL: useFlowStore,
  previousUrl: useFlowStore,
  tempCode: useFlowStore,
  statemachine_length: useFlowStore,
  selected_type: useFlowStore,
  
  // User store keys
  profileid: useUserStore,
  first_name: useUserStore,
  company: useUserStore,
  state: useUserStore,
  accessToken: useUserStore,
  phoneNumber: useUserStore,
  english_first_name: useUserStore,
  country: useUserStore,
  city: useUserStore,
  ip_city: useUserStore,
  ip_state: useUserStore,
  ip_country: useUserStore,
  device_id: useUserStore,
  
  // Chat store keys
  botName: useChatStore,
  'chat-history': useChatStore,
  intro_message: useChatStore,
  isChatVisible: useChatStore,
  isNewChatOpen: useChatStore,
  isOldChatOpen: useChatStore,
  showFileInput: useChatStore,
  llmError: useChatStore,
  chatLanguage: useChatStore,
  defaultBotName: useChatStore,
  
  // Language store keys
  route: useLanguageStore,
  preferred_route: useLanguageStore,
  local_route: useLanguageStore,
  hasSelectedLanguage: useLanguageStore,
  lang_progress: useLanguageStore,
  
  // UI store keys
  showHomepage: useUiStore,
  has_accepted_tnc: useUiStore,
  sessionid: useUiStore,
  grit: useUiStore,
};

/**
 * Gets the appropriate store for a given key
 * @param {string} key - Storage key
 * @returns {Object|null} The store instance or null if not found
 */
const getStoreForKey = (key) => {
  return KEY_STORE_MAP[key] || null;
};

/**
 * Backward-compatible setInStorage function
 * Matches the original storage_service.js API
 * 
 * @param {string} key - Storage key
 * @param {string} value - Value to store (will be JSON stringified if needed)
 * @param {string} currentFlow - Current flow type
 * @param {string} storageName - Explicit storage name ('sessionStorage' or 'localStorage')
 */
export const setInStorage = (key, value, currentFlow = null, storageName = '') => {
  // If explicit storageName is provided, use direct storage access
  // This maintains backward compatibility for code that specifies storage explicitly
  if (storageName && storageName !== '') {
    const storage = getStorage(storageName, currentFlow);
    const finalValue = typeof value === 'string' ? value : JSON.stringify(value);
    storage.setItem(key, finalValue);
    return;
  }

  const store = getStoreForKey(key);
  
  if (store) {
    // Use Zustand store with dynamic storage selection
    // Handle JSON stringification if needed
    let processedValue = value;
    if (typeof value === 'object' || typeof value === 'boolean' || typeof value === 'number') {
      processedValue = JSON.stringify(value);
    }
    
    // Parse it back to store in Zustand (since Zustand handles JSON automatically)
    try {
      processedValue = JSON.parse(processedValue);
    } catch (e) {
      // If parsing fails, it's likely already a string, use as-is
      processedValue = value;
    }
    
    store.getState().setValue(key, processedValue);
  } else {
    // Fallback to direct storage for unknown keys
    const storage = getStorage(storageName, currentFlow);
    const finalValue = typeof value === 'string' ? value : JSON.stringify(value);
    storage.setItem(key, finalValue);
  }
};

/**
 * Backward-compatible getFromStorage function
 * Matches the original storage_service.js API
 * 
 * @param {string} key - Storage key
 * @param {boolean} parseValue - Whether to parse JSON value
 * @param {string} storageName - Explicit storage name ('sessionStorage' or 'localStorage')
 * @returns {*} The stored value
 */
export const getFromStorage = (key, parseValue = false, storageName = '') => {
  // If explicit storageName is provided, use direct storage access
  // This maintains backward compatibility for code that specifies storage explicitly
  if (storageName && storageName !== '') {
    const storage = getStorage(storageName);
    const value = storage.getItem(key);
    
    if (value && parseValue) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(`Error parsing value for key "${key}":`, e);
        return null;
      }
    }
    
    return value;
  }

  const store = getStoreForKey(key);
  
  if (store) {
    // Use Zustand store with dynamic storage selection
    const value = store.getState().getValue(key);
    
    // Handle JSON parsing based on parseValue flag
    if (value !== null && parseValue) {
      // If it's already parsed (Zustand stores as object), return as-is
      if (typeof value === 'object') {
        return value;
      }
      // Otherwise try to parse if it's a string
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    }
    
    // If parseValue is false, return as string (matching original behavior)
    if (!parseValue && value !== null) {
      return typeof value === 'string' ? value : JSON.stringify(value);
    }
    
    return value;
  } else {
    // Fallback to direct storage for unknown keys
    const storage = getStorage(storageName);
    const value = storage.getItem(key);
    
    if (value && parseValue) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(`Error parsing value for key "${key}":`, e);
        return null;
      }
    }
    
    return value;
  }
};

/**
 * Backward-compatible removeFromStorage function
 * Matches the original storage_service.js API
 * 
 * @param {string} key - Storage key
 * @param {boolean} removeFromAll - Whether to remove from both storages
 * @param {string} storageName - Explicit storage name ('sessionStorage' or 'localStorage')
 */
export const removeFromStorage = (key, removeFromAll = false, storageName = '') => {
  if (removeFromAll) {
    // Remove from both storages and Zustand stores
    const storages = getBothStorages();
    if (storages.sessionStorage) storages.sessionStorage.removeItem(key);
    if (storages.localStorage) storages.localStorage.removeItem(key);
    
    const store = getStoreForKey(key);
    if (store) {
      store.getState().setValue(key, null);
    }
    return;
  }

  // If explicit storageName is provided, use direct storage access
  if (storageName && storageName !== '') {
    const storage = getStorage(storageName);
    storage.removeItem(key);
    return;
  }

  const store = getStoreForKey(key);
  
  if (store) {
    // Use Zustand store with dynamic storage selection
    store.getState().setValue(key, null);
  } else {
    // Fallback to direct storage for unknown keys
    const storage = getStorage(storageName);
    storage.removeItem(key);
  }
};

/**
 * Backward-compatible clearFromStorage function
 * Matches the original storage_service.js API
 * 
 * @param {boolean} removeFromAll - Whether to remove from both storages
 * @param {Array<string>} excludeKeys - Keys to exclude from clearing
 */
export const clearFromStorage = (removeFromAll = false, excludeKeys = []) => {
  try {
    const keysToRemove = [
      'botName', 'chat-history', 'company', 'first_name', 'has_accepted_tnc', 'intro_message', 
      'isChatVisible', 'isNewChatOpen', 'isOldChatOpen', 'profileid', 'route', 'sessionid', 'showFileInput', 
      'showHomepage', 'state', 'accessToken', 'flow', 'statemachine_length', 'selected_type', 
      'preferred_route', 'country', 'city', 'ip_city', 'ip_state', 'ip_country', 'llmError', 'lang_progress',
      'grit', 'device_id', 'defaultBotName', 'phoneNumber', 'english_first_name', 'hasSelectedLanguage', 'chatLanguage',
      'projectId', 'taskId', 'ssoRerouteURL'
    ];
    
    keysToRemove.forEach((key) => {
      if (!excludeKeys.includes(key)) {
        removeFromStorage(key, removeFromAll);
      }
    });
  } catch (error) {
    console.error("Error while clearing: ", error);
  }
};

