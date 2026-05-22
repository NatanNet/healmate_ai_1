import api from './api';

const moodService = {
  recordMood: async (moodData) => {
    try {
      const response = await api.post('/mood/record', moodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getWeeklyMoods: async () => {
    try {
      const response = await api.get('/mood/weekly');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMoodStats: async () => {
    try {
      const response = await api.get('/mood/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default moodService;
