/**
 * Auth Store - User authentication state management
 *
 * Uses Zustand with persistence to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager, communityApi } from '../api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        error: null
      }),

      /**
       * Login with tokens (received from test-token or real auth)
       */
      login: (accessToken, refreshToken, user) => {
        tokenManager.setTokens(accessToken, refreshToken);
        set({
          user,
          isAuthenticated: true,
          error: null
        });
      },

      /**
       * Logout - clear tokens and state
       */
      logout: async () => {
        try {
          const refreshToken = tokenManager.getRefreshToken();
          if (refreshToken) {
            await communityApi.auth.logout(refreshToken);
          }
        } catch (error) {
          console.warn('Logout API call failed:', error);
        } finally {
          tokenManager.clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      /**
       * Logout from all devices
       */
      logoutAll: async () => {
        try {
          await communityApi.auth.logoutAll();
        } catch (error) {
          console.warn('Logout all API call failed:', error);
        } finally {
          tokenManager.clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            error: null
          });
        }
      },

      /**
       * Check if user is authenticated (on app load)
       */
      checkAuth: () => {
        const hasTokens = tokenManager.hasTokens();
        if (!hasTokens) {
          set({ user: null, isAuthenticated: false });
          return false;
        }
        return get().isAuthenticated;
      },

      /**
       * Update user data
       */
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      /**
       * Set loading state
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * Set error
       */
      setError: (error) => set({ error }),

      /**
       * Clear error
       */
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Listen for auth:logout events from API client
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', (event) => {
    console.log('Auth logout event:', event.detail);
    useAuthStore.getState().logout();
  });
}

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export default useAuthStore;
