/**
 * Auth Store - User authentication state management
 *
 * Uses Zustand with persistence to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager, communityApi } from '../api';

interface User {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
  profilePhoto?: string | null;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  checkAuth: () => boolean;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) => set({
        user,
        isAuthenticated: !!user,
        error: null
      }),

      /**
       * Login with tokens (received from test-token or real auth)
       */
      login: (accessToken: string, refreshToken: string, user: User) => {
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
        } catch (error: unknown) {
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
        } catch (error: unknown) {
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
      updateUser: (updates: Partial<User>) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      /**
       * Set loading state
       */
      setLoading: (isLoading: boolean) => set({ isLoading }),

      /**
       * Set error
       */
      setError: (error: string | null) => set({ error }),

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
  window.addEventListener('auth:logout', (event: Event) => {
    const customEvent = event as CustomEvent<{ reason: string }>;
    console.log('Auth logout event:', customEvent.detail);
    useAuthStore.getState().logout();
  });
}

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export default useAuthStore;
