import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  notificationOpen: false,
  notification: null,
  loading: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  showNotification: (message, type = 'info', duration = 3000) => {
    set({
      notificationOpen: true,
      notification: { message, type }
    });

    setTimeout(() => {
      set({ notificationOpen: false, notification: null });
    }, duration);
  },

  hideNotification: () => set({ notificationOpen: false, notification: null }),
  setLoading: (loading) => set({ loading })
}));
