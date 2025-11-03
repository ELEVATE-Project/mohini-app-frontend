import { sessionFlowName } from "../pages/ShikshalokamVoiceChat/enum";

/**
 * Determines which storage type to use (sessionStorage or localStorage)
 * based on business logic: flow type and projectId presence
 * 
 * @param {string} storageName - Explicit storage name ('sessionStorage' or 'localStorage')
 * @param {string} currentFlow - Current flow type
 * @param {string} projectId - Project ID value
 * @returns {'sessionStorage'|'localStorage'} Storage type to use
 */
export const determineStorageType = (storageName = '', currentFlow = null, projectId = null) => {
  // If storageName is explicitly provided, use it
  if (storageName && storageName !== '') {
    return storageName === 'sessionStorage' ? 'sessionStorage' : 'localStorage';
  }

  // Determine flow if not provided
  const flow = currentFlow || 
    (typeof window !== 'undefined' && (sessionStorage.getItem('flow') || localStorage.getItem('flow'))) ||
    null;

  // Session flows that use temporary storage
  const sessionFlows = [
    sessionFlowName.GuestDiscussion,
    sessionFlowName.GuestMiStory,
    sessionFlowName.ListeningActivity
  ];

  // Check if we should use temporary storage
  // Use sessionStorage if:
  // 1. Flow is in sessionFlows list
  // 2. AND no projectId exists (in either storage)
  const shouldUseSessionStorage = flow && 
    sessionFlows.includes(flow) && 
    !projectId &&
    !(typeof window !== 'undefined' && (localStorage.getItem('projectId') || sessionStorage.getItem('projectId')));

  return shouldUseSessionStorage ? 'sessionStorage' : 'localStorage';
};

/**
 * Gets the actual storage object (sessionStorage or localStorage)
 * 
 * @param {string} storageName - Storage name ('sessionStorage' or 'localStorage')
 * @param {string} currentFlow - Current flow type
 * @param {string} projectId - Project ID value
 * @returns {Storage} The storage object
 */
export const getStorage = (storageName = '', currentFlow = null, projectId = null) => {
  const storageType = determineStorageType(storageName, currentFlow, projectId);
  return storageType === 'sessionStorage' ? sessionStorage : localStorage;
};

