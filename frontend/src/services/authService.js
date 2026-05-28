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

    // kirim login ke backend FastAPI
    const response = await api.post('/auth/login', {
      email,
      password
    });

    console.log('LOGIN RESPONSE:', response.data);

    // ambil semua data dari backend
    const data = response.data;

    // buat object user manual
    const user = {
      id: data.user_id,
      email: data.email,
      username: data.username,
      fullName: data.fullName
    };

    // simpan ke zustand
    useAuthStore.getState().login(user, data.token);

    return data;

  } catch (error) {

    console.error('LOGIN ERROR:', error);

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
