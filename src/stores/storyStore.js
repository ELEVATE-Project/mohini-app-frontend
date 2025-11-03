import { create } from 'zustand';

/**
 * Story store manages story data, editor, and file uploads
 * State: storyData, editor, editorCopyChanges, files, fileErrorText, storyMediaIdArray, isSaving
 */
const useStoryStore = create(
  (set, get) => ({
    // Story state
    storyData: null,
    editor: null,
    editorCopyChanges: null,
    files: [],
    fileErrorText: '',
    storyMediaIdArray: null,
    isSaving: false,

    // Actions
    setStoryData: (storyData) => set({ storyData }),
    setEditor: (editor) => set({ editor }),
    setEditorCopyChanges: (editorCopyChanges) => set({ editorCopyChanges }),
    setFiles: (files) => set({ files }),
    addFile: (file) => set((state) => ({ files: [...state.files, file] })),
    removeFile: (fileId) => 
      set((state) => ({
        files: state.files.filter((file) => file.id !== fileId),
      })),
    setFileErrorText: (fileErrorText) => set({ fileErrorText }),
    setStoryMediaIdArray: (storyMediaIdArray) => set({ storyMediaIdArray }),
    setIsSaving: (isSaving) => set({ isSaving }),

    // Clear all story data
    clear: () => set({
      storyData: null,
      editor: null,
      editorCopyChanges: null,
      files: [],
      fileErrorText: '',
      storyMediaIdArray: null,
      isSaving: false,
    }),
  })
);

export default useStoryStore;

