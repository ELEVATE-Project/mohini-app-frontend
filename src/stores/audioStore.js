import { create } from 'zustand';

/**
 * Audio store manages audio playback and TTS state
 * State: audioCache, isMute, isTalking, asrAudio, chatSocket
 */
const useAudioStore = create(
  (set, get) => ({
    // Audio state
    audioCache: {},
    isMute: true,
    isTalking: 0,
    asrAudio: null,
    chatSocket: null,

    // Actions
    setAudioCache: (audioCache) => set({ audioCache }),
    addToAudioCache: (id, audioUrl) => 
      set((state) => ({
        audioCache: {
          ...state.audioCache,
          [id]: audioUrl,
        },
      })),
    setIsMute: (isMute) => set({ isMute }),
    setIsTalking: (isTalking) => set({ isTalking }),
    setAsrAudio: (asrAudio) => set({ asrAudio }),
    setChatSocket: (chatSocket) => set({ chatSocket }),

    // Clear audio cache
    clearAudioCache: () => set({ audioCache: {} }),

    // Reset all audio state
    reset: () => set({
      audioCache: {},
      isMute: true,
      isTalking: 0,
      asrAudio: null,
      chatSocket: null,
    }),
  })
);

export default useAudioStore;

