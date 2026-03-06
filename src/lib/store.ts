
import { create } from 'zustand';

interface StoryState {
  currentChapter: number;
  progress: number;
  reducedMotion: boolean;
  isInteracting: boolean;
  lastInteractionTime: number;
  setChapter: (id: number) => void;
  setProgress: (val: number) => void;
  toggleReducedMotion: () => void;
  setInteracting: (val: boolean) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  currentChapter: 0,
  progress: 0,
  reducedMotion: false,
  isInteracting: false,
  lastInteractionTime: 0,
  setChapter: (id) => set({ currentChapter: id }),
  setProgress: (val) => set({ progress: val }),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  setInteracting: (val) => set({ isInteracting: val, lastInteractionTime: Date.now() }),
}));
