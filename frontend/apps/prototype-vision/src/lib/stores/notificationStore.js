/**
 * Notification Store - Real-time notifications state
 *
 * Manages notification list, unread count, and WebSocket connection
 */

import { create } from 'zustand';
import { communityApi } from '../api';

const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,

  // WebSocket connection state
  wsConnected: false,
  wsError: null,

  // Actions
  /**
   * Fetch notifications from API
   */
  fetchNotifications: async (reset = false) => {
    const { page, notifications, isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const currentPage = reset ? 1 : page;
      const response = await communityApi.notifications.list({
        page: currentPage,
        limit: 20
      });

      const data = response.data;
      const newNotifications = data.notifications || data.data || [];

      set({
        notifications: reset
          ? newNotifications
          : [...notifications, ...newNotifications],
        unreadCount: data.unreadCount || newNotifications.filter(n => !n.read).length,
        hasMore: newNotifications.length === 20,
        page: currentPage + 1,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false
      });
    }
  },

  /**
   * Load more notifications (pagination)
   */
  loadMore: () => {
    const { hasMore, isLoading } = get();
    if (hasMore && !isLoading) {
      get().fetchNotifications(false);
    }
  },

  /**
   * Refresh notifications (reset pagination)
   */
  refresh: () => {
    set({ page: 1, hasMore: true });
    get().fetchNotifications(true);
  },

  /**
   * Add new notification (from WebSocket)
   */
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      await communityApi.notifications.markRead(notificationId);

      set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      await communityApi.notifications.markAllRead();

      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  /**
   * Remove notification from list
   */
  removeNotification: (notificationId) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === notificationId);
      return {
        notifications: state.notifications.filter(n => n.id !== notificationId),
        unreadCount: notification && !notification.read
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount
      };
    });
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
      page: 1,
      hasMore: true
    });
  },

  /**
   * Set WebSocket connection status
   */
  setWsConnected: (connected) => set({ wsConnected: connected, wsError: null }),

  /**
   * Set WebSocket error
   */
  setWsError: (error) => set({ wsError: error, wsConnected: false }),

  /**
   * Update unread count (from server sync)
   */
  setUnreadCount: (count) => set({ unreadCount: count })
}));

// Selector hooks
export const useNotifications = () => useNotificationStore((state) => state.notifications);
export const useUnreadCount = () => useNotificationStore((state) => state.unreadCount);
export const useNotificationsLoading = () => useNotificationStore((state) => state.isLoading);

export default useNotificationStore;
