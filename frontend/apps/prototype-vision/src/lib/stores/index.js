/**
 * Stores Module - Re-exports all Zustand stores
 */

// Auth store
export {
  default as useAuthStore,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError
} from './authStore';

// UI store
export {
  default as useUIStore,
  useTheme,
  useSidebarOpen,
  useSidebarCollapsed,
  useGlobalLoading,
  useToasts
} from './uiStore';

// Notification store
export {
  default as useNotificationStore,
  useNotifications,
  useUnreadCount,
  useNotificationsLoading
} from './notificationStore';
