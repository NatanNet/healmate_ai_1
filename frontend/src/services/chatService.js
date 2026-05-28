import api from './api';

const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat/send', { message });
      console.log('✅ chatService response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ chatService error:', error);
      throw error.response?.data || error;
    }
  },

  getChatHistory: async (limit = 50, page = 1) => {
    try {
      const response = await api.get('/chat/history', {
        params: { limit, page }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteChat: async (chatId) => {
    try {
      const response = await api.delete(`/chat/${chatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default chatService;
