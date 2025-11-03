import { create } from 'zustand';

/**
 * Recording store manages voice recording state
 * State: hasStartedRecording, mediaRecorder, isRecognizing, hasStartedListening, seconds, intervalId
 */
const useRecordingStore = create(
  (set, get) => ({
    // Recording state
    hasStartedRecording: false,
    mediaRecorder: null,
    isRecognizing: false,
    hasStartedListening: false,
    seconds: 0,
    intervalId: null,

    // Actions
    setHasStartedRecording: (hasStartedRecording) => set({ hasStartedRecording }),
    setMediaRecorder: (mediaRecorder) => set({ mediaRecorder }),
    setIsRecognizing: (isRecognizing) => set({ isRecognizing }),
    setHasStartedListening: (hasStartedListening) => set({ hasStartedListening }),
    setSeconds: (seconds) => set({ seconds }),
    setIntervalId: (intervalId) => set({ intervalId }),

    // Reset recording state
    resetRecording: () => set({
      hasStartedRecording: false,
      mediaRecorder: null,
      isRecognizing: false,
      hasStartedListening: false,
      seconds: 0,
      intervalId: null,
    }),
  })
);

export default useRecordingStore;

