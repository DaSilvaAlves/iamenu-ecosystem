/**
 * UI Store - User interface state management
 *
 * Manages theme, sidebar, modals, and other UI state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  [key: string]: unknown;
}

interface ToastInput {
  type?: ToastType;
  message: string;
  duration?: number;
  [key: string]: unknown;
}

interface ModalState {
  isOpen: boolean;
  data: unknown;
}

interface UIState {
  // Theme
  theme: Theme;
  accentColor: string;

  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modals
  modals: Record<string, ModalState>;

  // Notifications panel
  notificationsPanelOpen: boolean;

  // Loading states
  globalLoading: boolean;
  loadingMessage: string;

  // Toast/Alerts queue
  toasts: Toast[];

  // Actions - Theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAccentColor: (color: string) => void;

  // Actions - Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Actions - Modals
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  isModalOpen: (modalId: string) => boolean;
  getModalData: (modalId: string) => unknown;

  // Actions - Notifications Panel
  toggleNotificationsPanel: () => void;
  setNotificationsPanelOpen: (open: boolean) => void;

  // Actions - Loading
  setGlobalLoading: (loading: boolean, message?: string) => void;

  // Actions - Toasts
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  showSuccess: (message: string, options?: Partial<ToastInput>) => string;
  showError: (message: string, options?: Partial<ToastInput>) => string;
  showWarning: (message: string, options?: Partial<ToastInput>) => string;
  showInfo: (message: string, options?: Partial<ToastInput>) => string;
}

const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      accentColor: 'orange',

      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,

      // Modals
      modals: {},

      // Notifications panel
      notificationsPanelOpen: false,

      // Loading states
      globalLoading: false,
      loadingMessage: '',

      // Toast/Alerts queue
      toasts: [],

      // Actions - Theme
      setTheme: (theme: Theme) => {
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
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },

      setAccentColor: (color: string) => set({ accentColor: color }),

      // Actions - Sidebar
      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen
      })),

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      toggleSidebarCollapse: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      })),

      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

      // Actions - Modals
      openModal: (modalId: string, data: unknown = {}) => set((state) => ({
        modals: {
          ...state.modals,
          [modalId]: { isOpen: true, data }
        }
      })),

      closeModal: (modalId: string) => set((state) => ({
        modals: {
          ...state.modals,
          [modalId]: { isOpen: false, data: null }
        }
      })),

      closeAllModals: () => set({ modals: {} }),

      isModalOpen: (modalId: string) => get().modals[modalId]?.isOpen || false,

      getModalData: (modalId: string) => get().modals[modalId]?.data || null,

      // Actions - Notifications Panel
      toggleNotificationsPanel: () => set((state) => ({
        notificationsPanelOpen: !state.notificationsPanelOpen
      })),

      setNotificationsPanelOpen: (open: boolean) => set({ notificationsPanelOpen: open }),

      // Actions - Loading
      setGlobalLoading: (loading: boolean, message: string = '') => set({
        globalLoading: loading,
        loadingMessage: message
      }),

      // Actions - Toasts
      addToast: (toast: ToastInput) => {
        const id = Date.now().toString();
        const newToast: Toast = {
          id,
          type: 'info',
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

      removeToast: (id: string) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      clearToasts: () => set({ toasts: [] }),

      // Convenience methods for toasts
      showSuccess: (message: string, options: Partial<ToastInput> = {}) =>
        get().addToast({ type: 'success', message, ...options }),

      showError: (message: string, options: Partial<ToastInput> = {}) =>
        get().addToast({ type: 'error', message, ...options }),

      showWarning: (message: string, options: Partial<ToastInput> = {}) =>
        get().addToast({ type: 'warning', message, ...options }),

      showInfo: (message: string, options: Partial<ToastInput> = {}) =>
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
