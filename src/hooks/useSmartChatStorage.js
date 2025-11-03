import { getFromStorage, removeFromStorage } from "../services/storage_service";
import useChatStore from "../stores/chatStore";
import { sessionFlowName } from "../pages/ShikshalokamVoiceChat/enum";

/**
 * Hook for smart chat storage that automatically uses sessionStorage or localStorage
 * based on flow type. Uses Zustand chatStore for state management.
 */
const useSmartChatStorage = () => {
  const flow = getFromStorage('flow', false);
  const sessionFlows = [sessionFlowName.GuestDiscussion, sessionFlowName.GuestMiStory];
  const isTemporary = flow && sessionFlows.includes(flow);

  // Get chat history from store
  const chatHistory = useChatStore((state) => state['chat-history'] || []);

  // Get the setter function from store (not via selector)
  const setChatHistoryValue = (value) => {
    useChatStore.getState().setChatHistory(value);
  };

  const removeVal = () => {
    removeFromStorage('chat-history', false);
    setChatHistoryValue([]);
  };

  // Return value, setter, and remover matching the original API
  return [chatHistory, setChatHistoryValue, removeVal];
};

export default useSmartChatStorage