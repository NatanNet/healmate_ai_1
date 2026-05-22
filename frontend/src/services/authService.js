import api from './api';
import { useAuthStore } from '../stores/authStore';

const authService = {
  register: async (email, username, password, fullName) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
        fullName
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Save to store
      useAuthStore.getState().login(user, token);

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    useAuthStore.getState().logout();
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default authService;
