import { create } from 'zustand';
import goalService from '../services/goalService';

export const useGoalStore = create((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  // Fetch all goals
  fetchGoals: async () => {
    set({ loading: true });
    try {
      const data = await goalService.getGoals();
      set({ goals: data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Create goal
  createGoal: async (goalData) => {
    set({ loading: true });
    try {
      const newGoal = await goalService.createGoal(goalData);
      set((state) => ({ goals: [...state.goals, newGoal], error: null }));
      return newGoal;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update goal
  updateGoal: async (goalId, goalData) => {
    set({ loading: true });
    try {
      const updatedGoal = await goalService.updateGoal(goalId, goalData);
      set((state) => ({
        goals: state.goals.map((g) => (g._id === goalId ? updatedGoal : g)),
        error: null
      }));
      return updatedGoal;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Update progress
  updateProgress: async (goalId, progress) => {
    try {
      const updatedGoal = await goalService.updateProgress(goalId, progress);
      set((state) => ({
        goals: state.goals.map((g) => (g._id === goalId ? updatedGoal : g))
      }));
      return updatedGoal;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete goal
  deleteGoal: async (goalId) => {
    set({ loading: true });
    try {
      await goalService.deleteGoal(goalId);
      set((state) => ({
        goals: state.goals.filter((g) => g._id !== goalId),
        error: null
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Get active goals
  getActiveGoals: () => {
    const { goals } = get();
    return goals.filter((g) => g.status === 'active');
  },

  // Get completed goals
  getCompletedGoals: () => {
    const { goals } = get();
    return goals.filter((g) => g.status === 'completed');
  },

  // Clear error
  clearError: () => set({ error: null })
}));
