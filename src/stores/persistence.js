import { determineStorageType } from "../utils/storageUtils";

/**
 * Creates a dynamic storage adapter that implements the storage interface
 * for Zustand's persist middleware. It routes operations to sessionStorage
 * or localStorage based on current flow and projectId state.
 * 
 * The adapter checks both sessionStorage and localStorage to determine
 * which storage to use, avoiding circular dependencies.
 * 
 * @param {Function} getFlow - Function to get current flow from store state (optional fallback)
 * @param {Function} getProjectId - Function to get current projectId from store state (optional fallback)
 * @param {string} storageName - Optional explicit storage name override
 * @returns {Object} Storage adapter object with getItem, setItem, removeItem
 */
export const createDynamicStorageAdapter = (getFlow = null, getProjectId = null, storageName = '') => {
  const getStorage = () => {
    // Try to get flow and projectId from store functions first
    let flow = null;
    let projectId = null;
    
    try {
      if (getFlow) flow = getFlow();
      if (getProjectId) projectId = getProjectId();
    } catch (e) {
      // Store might not be initialized yet, fall back to direct storage check
    }
    
    // Fallback to checking storage directly if store functions don't provide values
    if (!flow && typeof window !== 'undefined') {
      flow = sessionStorage.getItem('flow') || localStorage.getItem('flow');
    }
    
    if (!projectId && typeof window !== 'undefined') {
      projectId = localStorage.getItem('projectId') || sessionStorage.getItem('projectId');
      // Try to parse if it's JSON stringified
      if (projectId) {
        try {
          projectId = JSON.parse(projectId);
        } catch (e) {
          // Not JSON, use as-is
        }
      }
    }
    
    const storageType = determineStorageType(storageName, flow, projectId);
    return storageType === 'sessionStorage' ? sessionStorage : localStorage;
  };

  return {
    getItem: (name) => {
      try {
        const storage = getStorage();
        return storage.getItem(name);
      } catch (e) {
        console.error(`Error getting item "${name}" from storage:`, e);
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        const storage = getStorage();
        storage.setItem(name, value);
      } catch (e) {
        console.error(`Error setting item "${name}" in storage:`, e);
      }
    },
    removeItem: (name) => {
      try {
        const storage = getStorage();
        storage.removeItem(name);
      } catch (e) {
        console.error(`Error removing item "${name}" from storage:`, e);
      }
    },
  };
};

/**
 * Helper to get both storages for operations that need to check/remove from both
 * @returns {Object} Object with both storage instances
 */
export const getBothStorages = () => ({
  sessionStorage: typeof window !== 'undefined' ? sessionStorage : null,
  localStorage: typeof window !== 'undefined' ? localStorage : null,
});

