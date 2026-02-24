/**
 * API Client - Centralized Axios instance with JWT handling
 *
 * Features:
 * - Automatic token injection
 * - Automatic token refresh on 401/403
 * - Request/Response interceptors
 * - Error handling
 */

import axios, { AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../../config/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Queue item for failed requests during token refresh
interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (reason: unknown) => void;
}

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => !!localStorage.getItem(ACCESS_TOKEN_KEY)
};

// Create axios instance
const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If error is 401/403 and we haven't tried to refresh yet
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      tokenManager.getRefreshToken()
    ) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        const response = await axios.post(
          `${API_CONFIG.COMMUNITY_API}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        tokenManager.setTokens(accessToken, newRefreshToken);

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.clearTokens();

        // Dispatch event for UI to handle (redirect to login)
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'session_expired' }
        }));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Service-specific API clients
export const communityApi = {
  baseURL: API_CONFIG.COMMUNITY_API,

  // Posts
  posts: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/posts`, { params }),
    get: (id: string) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/posts/${id}`),
    create: (data: Record<string, unknown>) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/posts`, data),
    update: (id: string, data: Record<string, unknown>) => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/posts/${id}`, data),
    delete: (id: string) => apiClient.delete(`${API_CONFIG.COMMUNITY_API}/posts/${id}`),
    react: (id: string, reactionType: string) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/posts/${id}/reactions`, { reactionType })
  },

  // Groups
  groups: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/groups`, { params }),
    get: (id: string) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/groups/${id}`),
    create: (data: Record<string, unknown>) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/groups`, data),
    join: (id: string) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/groups/${id}/join`),
    leave: (id: string) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/groups/${id}/leave`)
  },

  // Profiles
  profiles: {
    get: (userId: string) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}`),
    update: (userId: string, data: Record<string, unknown>) => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}`, data),
    follow: (userId: string) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}/follow`),
    unfollow: (userId: string) => apiClient.delete(`${API_CONFIG.COMMUNITY_API}/profiles/${userId}/follow`)
  },

  // Notifications
  notifications: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/notifications`, { params }),
    markRead: (id: string) => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/notifications/${id}/read`),
    markAllRead: () => apiClient.patch(`${API_CONFIG.COMMUNITY_API}/notifications/read-all`)
  },

  // Gamification
  gamification: {
    getPoints: (userId: string) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/gamification/points/${userId}`),
    getLeaderboard: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/gamification/leaderboard`, { params }),
    getAchievements: (userId: string) => apiClient.get(`${API_CONFIG.COMMUNITY_API}/gamification/achievements/${userId}`)
  },

  // Auth
  auth: {
    refresh: (refreshToken: string) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/auth/refresh`, { refreshToken }),
    logout: (refreshToken: string) => apiClient.post(`${API_CONFIG.COMMUNITY_API}/auth/logout`, { refreshToken }),
    logoutAll: () => apiClient.post(`${API_CONFIG.COMMUNITY_API}/auth/logout-all`),
    getSessions: () => apiClient.get(`${API_CONFIG.COMMUNITY_API}/auth/sessions`)
  }
};

export const marketplaceApi = {
  baseURL: API_CONFIG.MARKETPLACE_API,

  // Suppliers
  suppliers: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/suppliers`, { params }),
    get: (id: string) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/suppliers/${id}`),
    getProducts: (id: string, params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/suppliers/${id}/products`, { params })
  },

  // Products
  products: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/products`, { params }),
    compare: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/products/compare`, { params })
  },

  // Quotes (RFQ)
  quotes: {
    create: (data: Record<string, unknown>) => apiClient.post(`${API_CONFIG.MARKETPLACE_API}/quotes/request`, data),
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/quotes/requests`, { params }),
    respond: (id: string, data: Record<string, unknown>) => apiClient.post(`${API_CONFIG.MARKETPLACE_API}/quotes/${id}/respond`, data)
  },

  // Collective Bargains
  bargains: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/collective-bargains`, { params }),
    get: (id: string) => apiClient.get(`${API_CONFIG.MARKETPLACE_API}/collective-bargains/${id}`),
    join: (id: string, data: Record<string, unknown>) => apiClient.post(`${API_CONFIG.MARKETPLACE_API}/collective-bargains/${id}/join`, data)
  }
};

export const academyApi = {
  baseURL: API_CONFIG.ACADEMY_API,

  // Courses
  courses: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.ACADEMY_API}/courses`, { params }),
    get: (id: string) => apiClient.get(`${API_CONFIG.ACADEMY_API}/courses/${id}`),
    getBySlug: (slug: string) => apiClient.get(`${API_CONFIG.ACADEMY_API}/courses/slug/${slug}`)
  },

  // Enrollments
  enrollments: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.ACADEMY_API}/enrollments`, { params }),
    create: (courseId: string) => apiClient.post(`${API_CONFIG.ACADEMY_API}/enrollments`, { courseId }),
    updateProgress: (enrollmentId: string, data: Record<string, unknown>) => apiClient.patch(`${API_CONFIG.ACADEMY_API}/enrollments/${enrollmentId}/progress`, data)
  },

  // Certificates
  certificates: {
    list: (params?: Record<string, unknown>) => apiClient.get(`${API_CONFIG.ACADEMY_API}/certificates`, { params }),
    verify: (code: string) => apiClient.get(`${API_CONFIG.ACADEMY_API}/certificates/verify/${code}`)
  }
};

export const businessApi = {
  baseURL: API_CONFIG.BUSINESS_API,

  // Dashboard
  dashboard: {
    getStats: (period: string) => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/stats`, { params: { period } }),
    getTopProducts: (limit: number) => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/top-products`, { params: { limit } }),
    getAlerts: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/alerts`),
    getOpportunities: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/opportunities`),
    getSalesTrends: (period: string) => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/sales-trends`, { params: { period } }),
    getMenuEngineering: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/menu-engineering`),
    getDemandForecast: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/demand-forecast`),
    getPeakHours: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/peak-hours-heatmap`),
    getBenchmark: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/dashboard/benchmark`)
  },

  // Onboarding
  onboarding: {
    setup: (formData: FormData) => apiClient.post(`${API_CONFIG.BUSINESS_API}/onboarding/setup`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getStatus: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/onboarding/status`),
    downloadTemplate: () => apiClient.get(`${API_CONFIG.BUSINESS_API}/onboarding/template`, { responseType: 'blob' })
  }
};

// Default export
export default apiClient;
