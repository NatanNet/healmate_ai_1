import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const goalService = {
  // Create new goal
  createGoal: async (goalData) => {
    try {
      const response = await axios.post(`${API_URL}/goals/create`, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all goals for user
  getGoals: async () => {
    try {
      const response = await axios.get(`${API_URL}/goals`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single goal
  getGoalById: async (goalId) => {
    try {
      const response = await axios.get(`${API_URL}/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update goal
  updateGoal: async (goalId, goalData) => {
    try {
      const response = await axios.put(`${API_URL}/goals/${goalId}`, goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update goal progress
  updateProgress: async (goalId, progress) => {
    try {
      const response = await axios.put(`${API_URL}/goals/${goalId}/progress`, { progress });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete goal
  deleteGoal: async (goalId) => {
    try {
      const response = await axios.delete(`${API_URL}/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get goal statistics
  getStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default goalService;
