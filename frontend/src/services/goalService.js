import api from './api';

const goalService = {
  // 1. Mengambil semua target milik user yang sedang login
  getGoals: async () => {
    try {
      const response = await api.get('/goals/');
      if (response.data && response.data.goals) {
        return response.data.goals;
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Gagal mengambil target pemulihan:', error);
      return [];
    }
  },

  // 2. Membuat target baru
  createGoal: async (title, description = '') => {
    try {
      const response = await api.post('/goals/create', {
        title,
        description
      });
      return response.data;
    } catch (error) {
      console.error('Gagal membuat target baru:', error);
      throw error;
    }
  },

  // 3. Mengubah status target menjadi selesai (completed) atau aktif kembali
  updateGoalStatus: async (goalId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'completed' ? 'active' : 'completed';
      const response = await api.put(`/goals/${goalId}`, {
        status: nextStatus
      });
      return response.data;
    } catch (error) {
      console.error('Gagal memperbarui status target:', error);
      throw error;
    }
  }, // <--- Jangan lupa koma di sini

  // 4. Menghapus target
  deleteGoal: async (goalId) => {
    try {
      const response = await api.delete(`/goals/${goalId}`);
      return response.data;
    } catch (error) {
      console.error('Gagal menghapus target:', error);
      throw error;
    }
  },

  // 5. Mengedit teks target
  updateGoalDetail: async (goalId, newTitle) => {
    try {
      const response = await api.put(`/goals/${goalId}`, {
        title: newTitle
      });
      return response.data;
    } catch (error) {
      console.error('Gagal mengedit target:', error);
      throw error;
    }
  }
}; 

export default goalService;