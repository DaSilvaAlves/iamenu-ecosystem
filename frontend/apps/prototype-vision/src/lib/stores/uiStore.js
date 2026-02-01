/**
 * UI Store - User interface state management
 *
 * Manages theme, sidebar, modals, and other UI state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark', // 'light' | 'dark' | 'system'
      accentColor: 'orange', // Primary accent color

      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,

      // Modals
      modals: {}, // { [modalId]: { isOpen, data } }

      // Notifications panel
      notificationsPanelOpen: false,

      // Loading states
      globalLoading: false,
      loadingMessage: '',

      // Toast/Alerts queue
      toasts: [],

      // Actions - Theme
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },

      setAccentColor: (color) => set({ accentColor: color }),

      // Actions - Sidebar
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen
      })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebarCollapse: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Actions - Modals
      openModal: (modalId, data = {}) => set((state) => ({
        modals: {
          ...state.modals,
          [modalId]: { isOpen: true, data }
        }
      })),

      closeModal: (modalId) => set((state) => ({
        modals: {
          ...state.modals,
          [modalId]: { isOpen: false, data: null }
        }
      })),

      closeAllModals: () => set({ modals: {} }),

      isModalOpen: (modalId) => get().modals[modalId]?.isOpen || false,

      getModalData: (modalId) => get().modals[modalId]?.data || null,

      // Actions - Notifications Panel
      toggleNotificationsPanel: () => set((state) => ({
        notificationsPanelOpen: !state.notificationsPanelOpen
      })),

      setNotificationsPanelOpen: (open) => set({ notificationsPanelOpen: open }),

      // Actions - Loading
      setGlobalLoading: (loading, message = '') => set({
        globalLoading: loading,
        loadingMessage: message
      }),

      // Actions - Toasts
      addToast: (toast) => {
        const id = Date.now().toString();
        const newToast = {
          id,
          type: 'info', // 'success' | 'error' | 'warning' | 'info'
          duration: 5000,
          ...toast
        };

        set((state) => ({
          toasts: [...state.toasts, newToast]
        }));

        // Auto-remove after duration
        if (newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, newToast.duration);
        }

        return id;
      },

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      clearToasts: () => set({ toasts: [] }),

      // Convenience methods for toasts
      showSuccess: (message, options = {}) =>
        get().addToast({ type: 'success', message, ...options }),

      showError: (message, options = {}) =>
        get().addToast({ type: 'error', message, ...options }),

      showWarning: (message, options = {}) =>
        get().addToast({ type: 'warning', message, ...options }),

      showInfo: (message, options = {}) =>
        get().addToast({ type: 'info', message, ...options })
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
);

// Initialize theme on load
if (typeof document !== 'undefined') {
  const savedTheme = useUIStore.getState().theme;
  useUIStore.getState().setTheme(savedTheme);
}

// Selector hooks
export const useTheme = () => useUIStore((state) => state.theme);
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useSidebarCollapsed = () => useUIStore((state) => state.sidebarCollapsed);
export const useGlobalLoading = () => useUIStore((state) => ({
  loading: state.globalLoading,
  message: state.loadingMessage
}));
export const useToasts = () => useUIStore((state) => state.toasts);

export default useUIStore;
