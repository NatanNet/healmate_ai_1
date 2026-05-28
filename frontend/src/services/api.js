import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      // baseURL: 'https://natannet-healmate-ai-be1.hf.space/api',
      // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      baseURL: import.meta.env.VITE_API_URL || 'https://natannet-healmate-ai-be1.hf.space/api',
  withCredentials: true
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    console.log("TOKEN LOGIN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {

    const token = useAuthStore.getState().token;

    if (error.response?.status === 401 && token) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


export default api;