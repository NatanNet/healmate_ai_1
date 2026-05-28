import { create } from 'zustand';

export const useChatStore = create((set) => ({
  chats: [],
  loading: false,
  error: null,

  latesEmotion: null,

  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  deleteChat: (chatId) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat._id !== chatId)
    })),

    setLatestEmotion: (emotion) => set({ latestEmotion: emotion }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
