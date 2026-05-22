import { create } from 'zustand';

export const useMoodStore = create((set) => ({
  moods: [],
  weeklyMoods: [],
  stats: null,
  loading: false,
  error: null,

  setMoods: (moods) => set({ moods }),
  addMood: (mood) => set((state) => ({ moods: [...state.moods, mood] })),
  setWeeklyMoods: (weeklyMoods) => set({ weeklyMoods }),
  setStats: (stats) => set({ stats }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
